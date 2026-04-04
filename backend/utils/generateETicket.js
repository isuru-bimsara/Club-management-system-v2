const { v4: uuidv4 } = require('uuid');
const generateQRCode = require('./generateQRCode');

const generateETicket = async () => {
  const code = uuidv4();
  const qrCodeImage = await generateQRCode(code);
  
  return {
    eTicketCode: code,
    qrCodeImage: qrCodeImage
  };
};

module.exports = generateETicket;
