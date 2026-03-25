// //backend/models/Merchandise.js
// const mongoose = require('mongoose');

// const bankDetailSchema = new mongoose.Schema({
//   bankName: { type: String, required: true },
//   accountName: { type: String, required: true },
//   accountNumber: { type: String, required: true },
//   branch: { type: String },
// });

// const merchandiseSchema = new mongoose.Schema(
//   {
//     event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
//     name: { type: String, required: true, trim: true },
//     image: { type: String, default: '' },
//     price: { type: Number, required: true, min: 0 },
//     totalQuantity: { type: Number, required: true, min: 1 },
//     soldQuantity: { type: Number, default: 0 },
//     bankDetails: [bankDetailSchema], // multiple bank options per event
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Merchandise', merchandiseSchema);


const mongoose = require('mongoose');

const bankDetailSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  branch: { type: String },
});

const merchandiseSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true, trim: true },
    venue: { type: String, required: true },          // NEW
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    totalQuantity: { type: Number, required: true, min: 1 },
    soldQuantity: { type: Number, default: 0 },
    bankDetails: [bankDetailSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Merchandise', merchandiseSchema);