// //backend/utils/sendEmail.js
// const nodemailer = require('nodemailer');

// const sendEmail = async ({ email, subject, html, text, attachments }) => {
//   const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
//   const pass = process.env.GMAIL_PASSWORD || process.env.EMAIL_PASS;

//   if (!user || !pass) {
//     throw new Error('Email credentials missing: set GMAIL_USER & GMAIL_PASSWORD (or EMAIL_USER / EMAIL_PASS)');
//   }

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: { user, pass },
//   });

//   return transporter.sendMail({
//     from: `"SLIIT Events" <${user}>`,
//     to: email,
//     subject,
//     html: html || undefined,
//     text: text || undefined,
//     attachments: attachments || [],
//   });
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

/**
 * Escape user-provided text before injecting into HTML template
 */
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/**
 * Base sender (generic)
 */
const sendEmail = async ({ email, subject, html, text, attachments }) => {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      "Email credentials missing: set GMAIL_USER & GMAIL_PASSWORD (or EMAIL_USER / EMAIL_PASS)",
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporter.sendMail({
    from: `"SLIIT Events" <${user}>`,
    to: email,
    subject,
    html: html || undefined,
    text: text || undefined,
    attachments: attachments || [],
  });
};

/**
 * Beautiful template for approved merchandise order
 */
const buildOrderApprovedTemplate = ({
  buyerName,
  itemName,
  quantity,
  size,
  amount,
  pickupVenue,
  invoiceUrl,
}) => {
  const safeBuyer = escapeHtml(buyerName || "there");
  const safeItem = escapeHtml(itemName || "Item");
  const safeSize = escapeHtml(size || "");
  const safeVenue = escapeHtml(pickupVenue || "Will be notified");
  const safeInvoiceUrl = escapeHtml(invoiceUrl || "");
  const safeAmount = Number(amount || 0).toFixed(2);

  const html = `
  <div style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
      <div style="padding:18px 22px;background:linear-gradient(135deg,#16a34a,#0f766e);color:#fff;">
        <h2 style="margin:0;font-size:22px;">SLIIT Events</h2>
        <p style="margin:6px 0 0;font-size:13px;opacity:.95;">Merchandise Approval Confirmation</p>
      </div>

      <div style="padding:20px 22px;color:#0f172a;font-size:14px;line-height:1.7;">
        <p style="margin:0 0 10px;">Hi <strong>${safeBuyer}</strong>,</p>
        <p style="margin:0 0 14px;">
          Your order for <strong>${safeItem}</strong> has been
          <strong style="color:#16a34a;">approved</strong>.
        </p>

        <div style="border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;background:#f8fafc;">
          <p style="margin:0 0 8px;font-weight:700;color:#334155;">Order Summary</p>
          <p style="margin:4px 0;">Quantity: <strong>${quantity}</strong></p>
          ${safeSize ? `<p style="margin:4px 0;">Size: <strong>${safeSize}</strong></p>` : ""}
          <p style="margin:4px 0;">Total Paid: <strong>LKR ${safeAmount}</strong></p>
          <p style="margin:4px 0;">Pickup Venue: <strong>${safeVenue}</strong></p>
        </div>


        <p style="margin:14px 0 0;color:#475569;">
          Please bring your payment confirmation when collecting your item.
        </p>
      </div>

      <div style="padding:12px 22px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:12px;">
        This is an automated email from SLIIT Events.
      </div>
    </div>
  </div>
  `;

  const text = [
    `Hi ${buyerName || "there"},`,
    ``,
    `Your order for ${itemName || "Item"} has been approved.`,
    `Quantity: ${quantity}`,
    size ? `Size: ${size}` : "",
    `Total Paid: LKR ${safeAmount}`,
    `Pickup Venue: ${pickupVenue || "Will be notified"}`,
    invoiceUrl ? `Invoice: ${invoiceUrl}` : "",
    ``,
    `SLIIT Events`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
};

module.exports = sendEmail;
module.exports.buildOrderApprovedTemplate = buildOrderApprovedTemplate;
