// //backend/models/MerchOrder.js
// const mongoose = require('mongoose');

// const merchOrderSchema = new mongoose.Schema(
//   {
//     merchandise: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchandise', required: true },
//     buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     quantity: { type: Number, required: true, min: 1 },
//     amount: { type: Number, required: true },
//     receiptImage: { type: String, required: true }, // uploaded slip
//     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//     pickupVenue: { type: String }, // derived from event venue for the receipt
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('MerchOrder', merchOrderSchema);


const mongoose = require('mongoose');

const merchOrderSchema = new mongoose.Schema(
  {
    merchandise: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchandise', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true },
    receiptImage: { type: String, required: true },          // uploaded slip
    invoicePdf: { type: String, default: '' },               // generated after approval
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    pickupVenue: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MerchOrder', merchOrderSchema);