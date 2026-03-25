// // // const nodemailer = require('nodemailer');

// // // const sendEmail = async (options) => {
// // //   const transporter = nodemailer.createTransport({
// // //     host: process.env.EMAIL_HOST,
// // //     port: process.env.EMAIL_PORT,
// // //     secure: false, // true for 465, false for other ports
// // //     auth: {
// // //       user: process.env.EMAIL_USER,
// // //       pass: process.env.EMAIL_PASS,
// // //     },
// // //   });

// // //   const mailOptions = {
// // //     from: `"SLIIT Events" <${process.env.EMAIL_USER}>`,
// // //     to: options.email,
// // //     subject: options.subject,
// // //     html: options.html,
// // //   };

// // //   const info = await transporter.sendMail(mailOptions);
// // //   return info;
// // // };

// // // module.exports = sendEmail;


// // const nodemailer = require('nodemailer');

// // const sendEmail = async ({ email, subject, html, text }) => {
// //   const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
// //   const pass = process.env.GMAIL_PASSWORD || process.env.EMAIL_PASS;

// //   if (!user || !pass) {
// //     throw new Error('Email credentials missing: set GMAIL_USER and GMAIL_PASSWORD (or EMAIL_USER / EMAIL_PASS)');
// //   }

// //   const transporter = nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: { user, pass },
// //   });

// //   return transporter.sendMail({
// //     from: `"SLIIT Events" <${user}>`,
// //     to: email,
// //     subject,
// //     html: html || undefined,
// //     text: text || undefined,
// //   });
// // };

// // module.exports = sendEmail;


// const nodemailer = require('nodemailer');

// const sendEmail = async ({ email, subject, html, text }) => {
//   const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
//   const pass = process.env.GMAIL_PASSWORD || process.env.EMAIL_PASS;

//   if (!user || !pass) {
//     throw new Error('Email credentials missing: set GMAIL_USER and GMAIL_PASSWORD (or EMAIL_USER / EMAIL_PASS)');
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
//   });
// };

// module.exports = sendEmail;

const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, html, text, attachments }) => {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('Email credentials missing: set GMAIL_USER & GMAIL_PASSWORD (or EMAIL_USER / EMAIL_PASS)');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
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

module.exports = sendEmail;