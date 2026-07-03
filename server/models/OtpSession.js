const mongoose = require('mongoose');

const otpSessionSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 } // TTL index
});

module.exports = mongoose.model('OtpSession', otpSessionSchema);
