const crypto = require('crypto');

const generateQRToken = (vehicleId) => {
  // RL-123456-DF format
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const char1 = chars.charAt(Math.floor(Math.random() * chars.length));
  const char2 = chars.charAt(Math.floor(Math.random() * chars.length));
  
  return `RL-${randomDigits}-${char1}${char2}`;
};

module.exports = {
  generateQRToken
};
