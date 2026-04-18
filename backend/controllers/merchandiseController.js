const Merchandise = require("../models/Merchandise");
const Event = require("../models/Event");
const MerchOrder = require("../models/MerchOrder");
const sendMail = require("../utils/sendEmail");
const generateInvoicePdf = require("../utils/genarateInvoicePdf");

const uploadsBase = process.env.UPLOADS_URL || "http://localhost:5000/uploads";
const invoicesBase = `${uploadsBase}/invoices`;

const parseBanks = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};

const parseSizes = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};

const normalizeSizes = (sizes = []) =>
  sizes
    .map((s) => ({
      size: String(s.size || "").trim(),
      quantity: Number(s.quantity || 0),
      soldQuantity: Number(s.soldQuantity || 0),
    }))
    .filter((s) => s.size && Number.isFinite(s.quantity) && s.quantity >= 0);

const getMyMerchandise = async (req, res) => {
  const merch = await Merchandise.find({ createdBy: req.user._id }).populate("event");
  res.json(merch);
};

const createMerchandise = async (req, res) => {
  const { eventId, name, price, totalQuantity, venue } = req.body;
  const bankDetails = parseBanks(req.body.bankDetails);

  const hasSizes = req.body.hasSizes === true || req.body.hasSizes === "true";
  const parsedSizes = normalizeSizes(parseSizes(req.body.sizes));

  const event = await Event.findOne({ _id: eventId, createdBy: req.user._id });
  if (!event) return res.status(403).json({ message: "Not your event" });

  let finalTotalQuantity = Number(totalQuantity);
  let finalSizes = [];

  if (hasSizes) {
    if (!parsedSizes.length) {
      return res.status(400).json({ message: "Sizes are required when size mode is enabled" });
    }
    const set = new Set(parsedSizes.map((s) => s.size.toLowerCase()));
    if (set.size !== parsedSizes.length) {
      return res.status(400).json({ message: "Duplicate sizes are not allowed" });
    }

    finalSizes = parsedSizes.map((s) => ({ size: s.size, quantity: s.quantity, soldQuantity: 0 }));
    finalTotalQuantity = finalSizes.reduce((sum, s) => sum + s.quantity, 0);
    if (finalTotalQuantity <= 0) {
      return res.status(400).json({ message: "Total size quantity must be greater than 0" });
    }
  }

  const merchandise = await Merchandise.create({
    event: eventId,
    name,
    venue,
    price,
    totalQuantity: hasSizes ? finalTotalQuantity : totalQuantity,
    soldQuantity: 0,
    hasSizes,
    sizes: hasSizes ? finalSizes : [],
    bankDetails,
    image: req.file ? `${uploadsBase}/merchitems/${req.file.filename}` : "",
    createdBy: req.user._id,
  });

  res.status(201).json(merchandise);
};

const updateMerchandise = async (req, res) => {
  const { id } = req.params;
  const merch = await Merchandise.findOne({ _id: id, createdBy: req.user._id });
  if (!merch) return res.status(404).json({ message: "Not found" });

  const bankDetails = parseBanks(req.body.bankDetails);
  const hasSizes = req.body.hasSizes === true || req.body.hasSizes === "true";
  const parsedSizes = normalizeSizes(parseSizes(req.body.sizes));

  merch.name = req.body.name ?? merch.name;
  merch.venue = req.body.venue ?? merch.venue;
  merch.price = req.body.price ?? merch.price;
  if (req.body.bankDetails) merch.bankDetails = bankDetails;
  if (req.file) merch.image = `${uploadsBase}/merchitems/${req.file.filename}`;

  if (hasSizes) {
    if (!parsedSizes.length) {
      return res.status(400).json({ message: "Sizes are required when size mode is enabled" });
    }

    const set = new Set(parsedSizes.map((s) => s.size.toLowerCase()));
    if (set.size !== parsedSizes.length) {
      return res.status(400).json({ message: "Duplicate sizes are not allowed" });
    }

    const oldMap = new Map((merch.sizes || []).map((s) => [s.size.toLowerCase(), s]));
    const nextSizes = parsedSizes.map((s) => {
      const prev = oldMap.get(s.size.toLowerCase());
      const prevSold = prev ? Number(prev.soldQuantity || 0) : 0;
      if (s.quantity < prevSold) {
        throw new Error(`Quantity for size "${s.size}" cannot be lower than sold (${prevSold})`);
      }
      return { size: s.size, quantity: s.quantity, soldQuantity: prevSold };
    });

    merch.hasSizes = true;
    merch.sizes = nextSizes;
    merch.totalQuantity = nextSizes.reduce((sum, s) => sum + s.quantity, 0);
    merch.soldQuantity = nextSizes.reduce((sum, s) => sum + s.soldQuantity, 0);
  } else {
    merch.hasSizes = false;
    merch.sizes = [];
    merch.totalQuantity = req.body.totalQuantity ?? merch.totalQuantity;
  }

  await merch.save();
  res.json(merch);
};

const deleteMerchandise = async (req, res) => {
  const { id } = req.params;
  const merch = await Merchandise.findOne({ _id: id, createdBy: req.user._id });
  if (!merch) return res.status(404).json({ message: "Not found" });
  await merch.deleteOne();
  res.json({ message: "Deleted" });
};

const getEventMerch = async (req, res) => {
  const { eventId } = req.params;
  const merch = await Merchandise.find({ event: eventId });
  res.json(merch);
};

const placeOrder = async (req, res) => {
  const { merchandiseId, quantity, size } = req.body;
  const qty = Number(quantity);

  if (!Number.isFinite(qty) || qty <= 0) return res.status(400).json({ message: "Invalid quantity" });
  if (!req.file) return res.status(400).json({ message: "Receipt required" });

  const merch = await Merchandise.findById(merchandiseId).populate("event");
  if (!merch) return res.status(404).json({ message: "Merch not found" });

  let selectedSize = "";

  if (merch.hasSizes) {
    selectedSize = String(size || "").trim();
    if (!selectedSize) return res.status(400).json({ message: "Size is required for this product" });

    const idx = (merch.sizes || []).findIndex(
      (s) => s.size.toLowerCase() === selectedSize.toLowerCase()
    );
    if (idx === -1) return res.status(400).json({ message: "Selected size is not available" });

    const row = merch.sizes[idx];
    const available = Number(row.quantity || 0) - Number(row.soldQuantity || 0);
    if (available < qty) return res.status(400).json({ message: "Not enough stock for selected size" });

    merch.sizes[idx].soldQuantity = Number(row.soldQuantity || 0) + qty;
    merch.soldQuantity = Number(merch.soldQuantity || 0) + qty;
    await merch.save();
  } else {
    const updated = await Merchandise.findOneAndUpdate(
      {
        _id: merchandiseId,
        $expr: {
          $gte: [{ $subtract: ["$totalQuantity", { $ifNull: ["$soldQuantity", 0] }] }, qty],
        },
      },
      { $inc: { soldQuantity: qty } },
      { new: true }
    );

    if (!updated) return res.status(400).json({ message: "Not enough stock" });
  }

  const amount = merch.price * qty;
  const order = await MerchOrder.create({
    merchandise: merchandiseId,
    buyer: req.user._id,
    quantity: qty,
    amount,
    size: selectedSize,
    receiptImage: `${uploadsBase}/receipts/${req.file.filename}`,
    pickupVenue: merch.venue || merch.event?.venue || "",
  });

  res.status(201).json(order);
};

const getOrdersForPresident = async (req, res) => {
  const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
  let query = {};

  if (!isAdmin) {
    const merchIds = await Merchandise.find({ createdBy: req.user._id }).select("_id");
    query = { merchandise: { $in: merchIds } };
  }

  const orders = await MerchOrder.find(query)
    .populate({
      path: "merchandise",
      populate: { path: "event", select: "name" },
    })
    .populate("buyer", "name email");

  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await MerchOrder.findById(id)
    .populate("merchandise")
    .populate("buyer", "name email");

  if (!order) return res.status(404).json({ message: "Order not found" });

  const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
  if (!isAdmin) {
    const isMine = await Merchandise.exists({
      _id: order.merchandise._id,
      createdBy: req.user._id,
    });
    if (!isMine) return res.status(403).json({ message: "Not authorized" });
  }

  const previousStatus = order.status;
  order.status = status;
  await order.save();

  if (previousStatus === "pending" && status === "rejected") {
    const merchDoc = await Merchandise.findById(order.merchandise._id);
    if (merchDoc) {
      if (merchDoc.hasSizes && order.size) {
        const idx = (merchDoc.sizes || []).findIndex(
          (s) => s.size.toLowerCase() === order.size.toLowerCase()
        );
        if (idx !== -1) {
          merchDoc.sizes[idx].soldQuantity = Math.max(
            0,
            Number(merchDoc.sizes[idx].soldQuantity || 0) - Number(order.quantity || 0)
          );
        }
      }
      merchDoc.soldQuantity = Math.max(
        0,
        Number(merchDoc.soldQuantity || 0) - Number(order.quantity || 0)
      );
      await merchDoc.save();
    }
  }

  if (status === "approved") {
    try {
      await generateInvoicePdf({
        orderId: order._id,
        buyerName: order.buyer?.name,
        itemName: order.merchandise.name,
        quantity: order.quantity,
        amount: order.amount,
        venue: order.pickupVenue,
      });
      order.invoicePdf = `${invoicesBase}/invoice-${order._id}.pdf`;
      await order.save();
    } catch (err) {
      console.error("Invoice PDF failed:", err.message);
    }

    try {
      // USE BEAUTIFUL TEMPLATE HERE
      const { html, text } = sendMail.buildOrderApprovedTemplate({
        buyerName: order.buyer?.name,
        itemName: order.merchandise?.name,
        quantity: order.quantity,
        size: order.size,
        amount: order.amount,
        pickupVenue: order.pickupVenue,
        invoiceUrl: order.invoicePdf || "",
      });

      await sendMail({
        email: order.buyer.email,
        subject: "Your merchandise order is approved",
        html,
        text,
      });
    } catch (err) {
      console.error("Email send failed:", err.message);
    }
  }

  res.json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await MerchOrder.find({ buyer: req.user._id })
    .populate("merchandise")
    .sort("-createdAt");
  res.json(orders);
};

module.exports = {
  getMyMerchandise,
  createMerchandise,
  updateMerchandise,
  deleteMerchandise,
  getEventMerch,
  placeOrder,
  getOrdersForPresident,
  updateOrderStatus,
  getMyOrders,
};