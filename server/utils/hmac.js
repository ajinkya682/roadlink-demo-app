const crypto = require('crypto');

const generateQRToken = (vehicleId) => {
  const secret = process.env.QR_SIGNING_SECRET || 'qr_hmac_secret';
  const salt = crypto.randomBytes(16).toString('hex');
  const payload = `${vehicleId}:${salt}`;
  
  const hmac = crypto.createHmac('sha256', secret)
                     .update(payload)
                     .digest('hex');
                     
  return `${payload}:${hmac}`;
};

const verifyQRToken = (token) => {
  const secret = process.env.QR_SIGNING_SECRET || 'qr_hmac_secret';
  const [vehicleId, salt, providedHmac] = token.split(':');
  
  if (!vehicleId || !salt || !providedHmac) return null;

  const payload = `${vehicleId}:${salt}`;
  const expectedHmac = crypto.createHmac('sha256', secret)
                             .update(payload)
                             .digest('hex');
                             
  if (expectedHmac === providedHmac) {
    return vehicleId;
  }
  return null;
};

module.exports = {
  generateQRToken,
  verifyQRToken
};
