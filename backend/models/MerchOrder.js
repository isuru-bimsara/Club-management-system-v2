const mongoose = require("mongoose");

const merchOrderSchema = new mongoose.Schema(
  {
    merchandise: { type: mongoose.Schema.Types.ObjectId, ref: "Merchandise", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true },
    receiptImage: { type: String, required: true },
    invoicePdf: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    pickupVenue: { type: String },

    // NEW optional selected size in order
    size: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MerchOrder", merchOrderSchema);