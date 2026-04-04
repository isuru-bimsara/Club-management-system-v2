// // // const PDFDocument = require('pdfkit');
// // // const fs = require('fs');
// // // const path = require('path');

// // // const generateInvoicePdf = ({ orderId, buyerName, itemName, quantity, amount, venue }) => {
// // //   const dir = path.join(__dirname, '..', 'uploads', 'invoices');
// // //   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// // //   const filePath = path.join(dir, `invoice-${orderId}.pdf`);

// // //   const doc = new PDFDocument({ margin: 50 });
// // //   const writeStream = fs.createWriteStream(filePath);
// // //   doc.pipe(writeStream);

// // //   doc.fontSize(18).text('Payment Confirmation', { align: 'center' });
// // //   doc.moveDown();
// // //   doc.fontSize(12).text(`Order ID: ${orderId}`);
// // //   doc.text(`Buyer: ${buyerName || 'Customer'}`);
// // //   doc.text(`Item: ${itemName}`);
// // //   doc.text(`Quantity: ${quantity}`);
// // //   doc.text(`Total Paid: LKR ${amount.toFixed(2)}`);
// // //   doc.text(`Pickup Venue: ${venue || 'Will be notified'}`);
// // //   doc.moveDown();
// // //   doc.text('Thank you for your purchase!', { align: 'left' });
// // //   doc.end();

// // //   return new Promise((resolve, reject) => {
// // //     writeStream.on('finish', () => resolve(filePath));
// // //     writeStream.on('error', reject);
// // //   });
// // // };

// // // module.exports = generateInvoicePdf;

// // const PDFDocument = require("pdfkit");
// // const fs = require("fs");
// // const path = require("path");

// // const THEME = {
// //   primary: "#16a34a", // matches primary-600
// //   primaryLight: "#dcfce7", // matches primary-100
// //   text: "#0f172a", // slate-900
// //   muted: "#475569", // slate-600
// //   border: "#e2e8f0", // slate-200
// // };

// // const line = (doc, x1, y1, x2, y2, color = THEME.border, width = 1) => {
// //   doc
// //     .save()
// //     .moveTo(x1, y1)
// //     .lineTo(x2, y2)
// //     .lineWidth(width)
// //     .strokeColor(color)
// //     .stroke()
// //     .restore();
// // };

// // const generateInvoicePdf = ({
// //   orderId,
// //   buyerName,
// //   itemName,
// //   quantity,
// //   amount,
// //   venue,
// // }) => {
// //   const dir = path.join(__dirname, "..", "uploads", "invoices");
// //   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// //   const filePath = path.join(dir, `invoice-${orderId}.pdf`);

// //   const doc = new PDFDocument({ margin: 50 });
// //   const writeStream = fs.createWriteStream(filePath);
// //   doc.pipe(writeStream);

// //   // Header bar
// //   doc.rect(0, 0, doc.page.width, 90).fill(THEME.primary);
// //   doc
// //     .fill("#ffffff")
// //     .fontSize(22)
// //     .font("Helvetica-Bold")
// //     .text("SLIIT Events", 50, 25);
// //   doc.fontSize(12).font("Helvetica").text("Payment Confirmation", 50, 55);

// //   // Card container
// //   doc
// //     .fillColor("#ffffff")
// //     .roundedRect(40, 110, doc.page.width - 80, 400)
// //     .fill("#ffffff")
// //     .strokeColor(THEME.border)
// //     .lineWidth(1)
// //     .stroke();

// //   const leftX = 70;
// //   let y = 140;

// //   // Order Summary
// //   doc
// //     .fillColor(THEME.text)
// //     .font("Helvetica-Bold")
// //     .fontSize(14)
// //     .text("Order Summary", leftX, y);
// //   y += 18;
// //   line(doc, leftX, y, doc.page.width - 70, y);
// //   y += 12;

// //   const rows = [
// //     ["Order ID", `${orderId}`],
// //     ["Buyer", buyerName || "Customer"],
// //     ["Item", itemName],
// //     ["Quantity", quantity],
// //     ["Total Paid", `LKR ${Number(amount || 0).toFixed(2)}`],
// //     ["Pickup Venue", venue || "Will be notified"],
// //   ];

// //   rows.forEach(([label, val]) => {
// //     doc
// //       .font("Helvetica-Bold")
// //       .fillColor(THEME.muted)
// //       .fontSize(10)
// //       .text(label.toUpperCase(), leftX, y);
// //     doc
// //       .font("Helvetica")
// //       .fillColor(THEME.text)
// //       .fontSize(12)
// //       .text(val, leftX, y + 12);
// //     y += 32;
// //   });

// //   // Status pill
// //   const pillY = y + 6;
// //   const pillText = "APPROVED";
// //   const pillWidth =
// //     doc.widthOfString(pillText, { font: "Helvetica-Bold", size: 11 }) + 16;
// //   doc
// //     .save()
// //     .roundedRect(leftX, pillY, pillWidth, 22, 11)
// //     .fill(THEME.primaryLight)
// //     .fillColor(THEME.primary)
// //     .font("Helvetica-Bold")
// //     .fontSize(11)
// //     .text(pillText, leftX + 8, pillY + 6)
// //     .restore();

// //   // Footer note
// //   doc
// //     .fillColor(THEME.muted)
// //     .font("Helvetica")
// //     .fontSize(10)
// //     .text(
// //       "Please present this confirmation at pickup. Thank you for your purchase!",
// //       leftX,
// //       pillY + 40,
// //     );

// //   doc.end();

// //   return new Promise((resolve, reject) => {
// //     writeStream.on("finish", () => resolve(filePath));
// //     writeStream.on("error", reject);
// //   });
// // };

// // module.exports = generateInvoicePdf;

// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");

// const THEME = {
//   primary: "#16a34a",
//   primaryLight: "#dcfce7",
//   text: "#0f172a",
//   muted: "#475569",
//   border: "#e2e8f0",
// };

// const generateInvoicePdf = ({
//   orderId,
//   buyerName,
//   itemName,
//   quantity,
//   amount,
//   venue,
// }) => {
//   const dir = path.join(__dirname, "..", "uploads", "invoices");
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

//   const filePath = path.join(dir, `invoice-${orderId}.pdf`);

//   const doc = new PDFDocument({ margin: 40 });
//   const stream = fs.createWriteStream(filePath);
//   doc.pipe(stream);

//   // 🔲 OUTER BORDER
//   doc
//     .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
//     .lineWidth(2)
//     .stroke(THEME.border);

//   // 🔥 HEADER
//   doc
//     .fillColor(THEME.primary)
//     .fontSize(24)
//     .font("Helvetica-Bold")
//     .text("SLIIT EVENTS", 50, 50);

//   doc
//     .fillColor(THEME.muted)
//     .fontSize(10)
//     .text("Malabe, Sri Lanka", 50, 80)
//     .text("Email: events@sliit.lk", 50, 95);

//   // 📄 INVOICE TITLE (RIGHT)
//   doc
//     .fillColor(THEME.text)
//     .fontSize(20)
//     .text("INVOICE", 400, 50);

//   doc
//     .fontSize(10)
//     .fillColor(THEME.muted)
//     .text(`Invoice ID: ${orderId}`, 400, 80)
//     .text(`Date: ${new Date().toLocaleDateString()}`, 400, 95);

//   // LINE
//   doc
//     .moveTo(50, 120)
//     .lineTo(doc.page.width - 50, 120)
//     .stroke(THEME.border);

//   // 👤 BILL TO
//   doc
//     .fillColor(THEME.text)
//     .font("Helvetica-Bold")
//     .fontSize(12)
//     .text("BILL TO:", 50, 140);

//   doc
//     .font("Helvetica")
//     .fontSize(11)
//     .text(buyerName || "Customer", 50, 160);

//   // 📦 TABLE HEADER
//   let tableTop = 200;

//   const col1 = 50;
//   const col2 = 250;
//   const col3 = 350;
//   const col4 = 450;

//   doc
//     .rect(50, tableTop, doc.page.width - 100, 25)
//     .fill(THEME.primaryLight);

//   doc
//     .fillColor(THEME.text)
//     .font("Helvetica-Bold")
//     .fontSize(11)
//     .text("Item", col1, tableTop + 8)
//     .text("Qty", col2, tableTop + 8)
//     .text("Price", col3, tableTop + 8)
//     .text("Total", col4, tableTop + 8);

//   // 📦 TABLE ROW
//   const rowY = tableTop + 30;

//   doc
//     .fillColor(THEME.text)
//     .font("Helvetica")
//     .fontSize(11)
//     .text(itemName, col1, rowY)
//     .text(quantity, col2, rowY)
//     .text(`LKR ${(amount / quantity).toFixed(2)}`, col3, rowY)
//     .text(`LKR ${amount.toFixed(2)}`, col4, rowY);

//   // TABLE BORDER
//   doc
//     .rect(50, tableTop, doc.page.width - 100, 60)
//     .stroke(THEME.border);

//   // 💰 TOTAL BOX
//   const totalY = rowY + 60;

//   doc
//     .rect(300, totalY, 200, 40)
//     .fill(THEME.primaryLight);

//   doc
//     .fillColor(THEME.text)
//     .font("Helvetica-Bold")
//     .fontSize(12)
//     .text("TOTAL", 310, totalY + 10);

//   doc
//     .text(`LKR ${amount.toFixed(2)}`, 400, totalY + 10);

//   // 📍 VENUE
//   doc
//     .fillColor(THEME.muted)
//     .font("Helvetica")
//     .fontSize(10)
//     .text(`Pickup Venue: ${venue || "Will be notified"}`, 50, totalY + 70);

//   // ✅ STATUS BADGE
//   doc
//     .roundedRect(50, totalY + 100, 120, 25, 10)
//     .fill(THEME.primaryLight);

//   doc
//     .fillColor(THEME.primary)
//     .font("Helvetica-Bold")
//     .fontSize(11)
//     .text("APPROVED", 65, totalY + 108);

//   // 📌 FOOTER
//   doc
//     .fillColor(THEME.muted)
//     .fontSize(9)
//     .text(
//       "This is a system generated invoice. Please bring this document when collecting your item.",
//       50,
//       doc.page.height - 80,
//       { width: doc.page.width - 100, align: "center" }
//     );

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => resolve(filePath));
//     stream.on("error", reject);
//   });
// };

// module.exports = generateInvoicePdf;

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const THEME = {
  primary: "#16a34a",
  primaryLight: "#dcfce7",
  text: "#0f172a",
  muted: "#475569",
  border: "#e2e8f0",
};

const generateInvoicePdf = ({
  orderId,
  buyerName,
  itemName,
  quantity,
  amount,
  venue,
}) => {
  const dir = path.join(__dirname, "..", "uploads", "invoices");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `invoice-${orderId}.pdf`);
  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const shortId = String(orderId).slice(-8).toUpperCase(); // fixed-length badge ID
  const today = new Date();

  // OUTER BORDER
  doc
    .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .lineWidth(2)
    .stroke(THEME.border);

  // HEADER
  doc
    .fillColor(THEME.primary)
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("SLIIT EVENTS", 50, 50);

  doc
    .fillColor(THEME.muted)
    .fontSize(10)
    .text("Malabe, Sri Lanka", 50, 80)
    .text("Email: events@sliit.lk", 50, 95);

  // INVOICE TITLE (RIGHT)
  doc
    .fillColor(THEME.text)
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("INVOICE", 400, 50, { width: 150, align: "right" });

  // Badge for invoice ID + date
  doc
    .fontSize(10)
    .fillColor(THEME.muted)
    .text(`Invoice ID: `, 400, 80, { width: 150, align: "right" });
  doc
    .font("Helvetica-Bold")
    .fillColor(THEME.text)
    .text(shortId, 400, 95, { width: 150, align: "right" });
  doc
    .font("Helvetica")
    .fillColor(THEME.muted)
    .text(`Date: ${today.toLocaleDateString()}`, 400, 110, {
      width: 150,
      align: "right",
    });

  // LINE
  doc
    .moveTo(50, 130)
    .lineTo(doc.page.width - 50, 130)
    .stroke(THEME.border);

  // BILL TO
  doc
    .fillColor(THEME.text)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("BILL TO:", 50, 150);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(THEME.text)
    .text(buyerName || "Customer", 50, 170);

  // TABLE HEADER
  let tableTop = 210;
  const col1 = 50;
  const col2 = 250;
  const col3 = 350;
  const col4 = 450;

  doc.rect(50, tableTop, doc.page.width - 100, 25).fill(THEME.primaryLight);

  doc
    .fillColor(THEME.text)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Item", col1, tableTop + 8)
    .text("Qty", col2, tableTop + 8)
    .text("Price", col3, tableTop + 8)
    .text("Total", col4, tableTop + 8);

  // TABLE ROW
  const rowY = tableTop + 30;
  const unit = amount && quantity ? amount / quantity : 0;

  doc
    .fillColor(THEME.text)
    .font("Helvetica")
    .fontSize(11)
    .text(itemName, col1, rowY, { width: col2 - col1 - 10 })
    .text(quantity, col2, rowY)
    .text(`LKR ${unit.toFixed(2)}`, col3, rowY)
    .text(`LKR ${amount.toFixed(2)}`, col4, rowY);

  // TABLE BORDER
  doc.rect(50, tableTop, doc.page.width - 100, 60).stroke(THEME.border);

  // TOTAL BOX
  const totalY = rowY + 70;
  doc
    .roundedRect(300, totalY, 200, 50, 8)
    .fill(THEME.primaryLight)
    .stroke(THEME.border);

  doc
    .fillColor(THEME.text)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("TOTAL", 310, totalY + 14);
  doc.font("Helvetica-Bold").text(`LKR ${amount.toFixed(2)}`, 400, totalY + 14);

  // VENUE
  doc
    .fillColor(THEME.muted)
    .font("Helvetica")
    .fontSize(10)
    .text(`Pickup Venue: ${venue || "Will be notified"}`, 50, totalY + 70);

  // STATUS BADGE
  doc.roundedRect(50, totalY + 100, 120, 25, 10).fill(THEME.primaryLight);
  doc
    .fillColor(THEME.primary)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("APPROVED", 65, totalY + 108);

  // FOOTER
  doc
    .fillColor(THEME.muted)
    .fontSize(9)
    .text(
      "This is a system generated invoice. Please bring this document when collecting your item.",
      50,
      doc.page.height - 80,
      { width: doc.page.width - 100, align: "center" },
    );
  doc
    .fontSize(8)
    .text(`Full Invoice ID: ${orderId}`, 50, doc.page.height - 60, {
      width: doc.page.width - 100,
      align: "center",
    });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generateInvoicePdf;
