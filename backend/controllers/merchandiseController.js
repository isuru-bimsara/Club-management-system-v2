const Merchandise = require("../models/Merchandise");
const Event = require("../models/Event");
const MerchOrder = require("../models/MerchOrder");
const sendMail = require("../utils/sendEmail");
const generateInvoicePdf = require("../utils/genarateInvoicePdf"); // keep your existing path/filename

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

const getMyMerchandise = async (req, res) => {
  const merch = await Merchandise.find({ createdBy: req.user._id }).populate(
    "event",
  );
  res.json(merch);
};

const createMerchandise = async (req, res) => {
  const { eventId, name, price, totalQuantity, venue } = req.body;
  const bankDetails = parseBanks(req.body.bankDetails);
  const event = await Event.findOne({ _id: eventId, createdBy: req.user._id });
  if (!event) return res.status(403).json({ message: "Not your event" });

  const merchandise = await Merchandise.create({
    event: eventId,
    name,
    venue,
    price,
    totalQuantity,
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
  merch.name = req.body.name ?? merch.name;
  merch.venue = req.body.venue ?? merch.venue;
  merch.price = req.body.price ?? merch.price;
  merch.totalQuantity = req.body.totalQuantity ?? merch.totalQuantity;
  if (req.body.bankDetails) merch.bankDetails = bankDetails;
  if (req.file) merch.image = `${uploadsBase}/merchitems/${req.file.filename}`;

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

/**
 * Reserve stock at order time.
 * Uses atomic update: only increments soldQuantity if sufficient stock remains.
 * Handles missing soldQuantity by treating it as 0.
 */
const placeOrder = async (req, res) => {
  const { merchandiseId, quantity } = req.body;
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0)
    return res.status(400).json({ message: "Invalid quantity" });

  const merch = await Merchandise.findById(merchandiseId).populate("event");
  if (!merch) return res.status(404).json({ message: "Merch not found" });
  if (!req.file) return res.status(400).json({ message: "Receipt required" });

  // Attempt atomic stock reservation
  const updated = await Merchandise.findOneAndUpdate(
    {
      _id: merchandiseId,
      $expr: {
        $gte: [
          { $subtract: ["$totalQuantity", { $ifNull: ["$soldQuantity", 0] }] },
          qty,
        ],
      },
    },
    { $inc: { soldQuantity: qty } },
    { new: true },
  );

  if (!updated) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  const amount = merch.price * qty;
  const order = await MerchOrder.create({
    merchandise: merchandiseId,
    buyer: req.user._id,
    quantity: qty,
    amount,
    receiptImage: `${uploadsBase}/receipts/${req.file.filename}`,
    pickupVenue: merch.venue || merch.event?.venue || "",
  });
  res.status(201).json(order);
};

const getOrdersForPresident = async (req, res) => {
  const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
  let query = {};

  if (!isAdmin) {
    const merchIds = await Merchandise.find({ createdBy: req.user._id }).select(
      "_id",
    );
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

/**
 * If approved: stock already reserved, keep as is.
 * If rejected: release reserved stock.
 */
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

  // Release stock on rejection (only if it was pending before)
  if (previousStatus === "pending" && status === "rejected") {
    await Merchandise.updateOne(
      { _id: order.merchandise._id },
      { $inc: { soldQuantity: -order.quantity } },
    );
  }

  // On approval, stock is already reserved; generate invoice + send email
  if (status === "approved") {
    try {
      const pdfPath = await generateInvoicePdf({
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
      await sendMail({
        email: order.buyer.email,
        subject: "Your merchandise order is approved",
        html: `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;padding:20px;background:#ffffff;">
    <div style="text-align:center;border-bottom:1px solid #e5e7eb;padding-bottom:12px;margin-bottom:16px;">
      <h2 style="margin:0;color:#16a34a;">SLIIT Events</h2>
      <p style="margin:4px 0 0;color:#475569;font-size:13px;">Payment Confirmation</p>
    </div>
    <p style="color:#0f172a;font-size:14px;">Hi ${order.buyer.name || "there"},</p>
    <p style="color:#0f172a;font-size:14px;">Your order for <strong>${order.merchandise.name}</strong> has been <strong style="color:#16a34a;">approved</strong>.</p>
    <ul style="color:#0f172a;font-size:14px;line-height:1.6;padding-left:18px;">
      <li>Quantity: <strong>${order.quantity}</strong></li>
      <li>Total Paid: <strong>LKR ${order.amount.toFixed(2)}</strong></li>
      <li>Pickup Venue: <strong>${order.pickupVenue || "Will be notified"}</strong></li>
    </ul>
    <p style="color:#475569;font-size:13px;">You can download your payment confirmation PDF from your dashboard. Please bring it when you pick up the item.</p>
    <p style="color:#0f172a;font-size:14px;margin-top:24px;">Thank you for your purchase!</p>
  </div>
`,
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
