const mongoose = require("mongoose");

const bankDetailSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  branch: { type: String },
});

// NEW
const merchSizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true, trim: true }, // e.g. XL, Small
    quantity: { type: Number, required: true, min: 0 },
    soldQuantity: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const merchandiseSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true, trim: true },
    venue: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },

    // Existing fields (kept)
    totalQuantity: { type: Number, required: true, min: 1 },
    soldQuantity: { type: Number, default: 0 },

    // NEW optional size support
    hasSizes: { type: Boolean, default: false },
    sizes: { type: [merchSizeSchema], default: [] },

    bankDetails: [bankDetailSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Merchandise", merchandiseSchema);