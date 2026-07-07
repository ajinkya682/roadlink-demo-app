const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  avatarUrl: { type: String },
  role: { type: String, default: 'owner' },
  deviceTokens: [{
    token: String,
    platform: { type: String, enum: ['web', 'android', 'ios'] },
    deviceId: { type: String, required: true },
    lastUsed: Date
  }],
  refreshTokens: [{
    tokenHash: String,
    expiresAt: Date,
    deviceInfo: String
  }],
  medicalProfile: {
    dob: String,
    address: String,
    bloodType: String,
    conditions: String,
    allergies: String,
    prescriptions: String,
    devices: String,
    doctorName: String,
    doctorPhone: String
  },
  subscriptionTier: { type: String, default: 'free' },
  notificationPrefs: {
    push: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sound: { type: Boolean, default: true },
    haptic: { type: Boolean, default: true },
    quietHours: {
      start: { type: String },
      end: { type: String }
    }
  },
  privacyPrefs: {
    publicVehicleProfile: { type: Boolean, default: true },
    displayPhoneNumber: { type: Boolean, default: false },
    plateSearchable: { type: Boolean, default: true },
    shareAnalytics: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
