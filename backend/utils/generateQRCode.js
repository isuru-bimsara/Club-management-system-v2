const QRCode = require('qrcode');

const generateQRCode = async (text) => {
  try {
    // Generate QR code as Base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (err) {
    console.error('QR Code Generation Error:', err);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = generateQRCode;
