const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  role: { type: String, default: 'owner' },
  refreshTokens: [{
    tokenHash: String,
    expiresAt: Date,
    deviceInfo: String
  }],
  subscriptionTier: { type: String, default: 'free' },
  notificationPrefs: {
    push: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    quietHours: {
      start: { type: String },
      end: { type: String }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
