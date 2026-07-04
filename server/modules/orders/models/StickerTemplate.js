const mongoose = require('mongoose');

const stickerTemplateSchema = new mongoose.Schema({
  tier: {
    type: String,
    enum: ['standard', 'reflective'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  previewImageUrl: {
    type: String,
    required: true
  },
  materialNote: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('StickerTemplate', stickerTemplateSchema);
