const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(40).toString('hex');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};
