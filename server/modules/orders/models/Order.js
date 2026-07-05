const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  tier: {
    type: String,
    enum: ['standard', 'reflective', 'premium'],
    required: true
  },
  templateSelections: [{
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'StickerTemplate' },
    position: { type: String, enum: ['front', 'back', null] },
    previewImageUrl: { type: String, default: null }
  }],
  customization: {
    layoutJson: { type: Object, default: null },
    previewImageUrl: { type: String, default: null }
  },
  pricing: {
    basePrice: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  shippingAddress: {
    name: { type: String, required: function() { return this.fulfillmentStatus !== 'draft'; } },
    line1: { type: String, required: function() { return this.fulfillmentStatus !== 'draft'; } },
    line2: { type: String },
    city: { type: String, required: function() { return this.fulfillmentStatus !== 'draft'; } },
    state: { type: String, required: function() { return this.fulfillmentStatus !== 'draft'; } },
    pincode: { type: String, required: function() { return this.fulfillmentStatus !== 'draft'; } },
    phone: { type: String, required: function() { return this.fulfillmentStatus !== 'draft'; } }
  },
  razorpayOrderId: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  fulfillmentStatus: {
    type: String,
    enum: ['draft', 'processing', 'printed', 'shipped', 'delivered'],
    default: 'draft'
  },
  receiptUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
