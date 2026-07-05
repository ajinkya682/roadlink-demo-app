require('dotenv').config();
const mongoose = require('mongoose');
const StickerTemplate = require('../modules/orders/models/StickerTemplate');

// Mock data
const templates = [
  {
    tier: 'standard',
    name: 'Classic Navy',
    previewImageUrl: 'https://via.placeholder.com/150/000080/FFFFFF?text=Classic+Navy',
    materialNote: 'Weatherproof vinyl'
  },
  {
    tier: 'standard',
    name: 'Signal Amber',
    previewImageUrl: 'https://via.placeholder.com/150/FFBF00/FFFFFF?text=Signal+Amber',
    materialNote: 'Weatherproof vinyl'
  },
  {
    tier: 'standard',
    name: 'Monochrome Edge',
    previewImageUrl: 'https://via.placeholder.com/150/333333/FFFFFF?text=Monochrome+Edge',
    materialNote: 'Weatherproof vinyl'
  },
  {
    tier: 'reflective',
    name: 'Night Glow Navy',
    previewImageUrl: 'https://via.placeholder.com/150/000080/FFFFFF?text=Glow+Navy',
    materialNote: 'Reflective, night-visible'
  },
  {
    tier: 'reflective',
    name: 'Hi-Vis Amber',
    previewImageUrl: 'https://via.placeholder.com/150/FFBF00/FFFFFF?text=Hi-Vis+Amber',
    materialNote: 'Reflective, night-visible'
  },
  {
    tier: 'reflective',
    name: 'Metallic Silver',
    previewImageUrl: 'https://via.placeholder.com/150/C0C0C0/000000?text=Metallic+Silver',
    materialNote: 'Reflective, night-visible'
  },
  {
    tier: 'reflective',
    name: 'Stealth Reflective',
    previewImageUrl: 'https://via.placeholder.com/150/111111/FFFFFF?text=Stealth+Reflective',
    materialNote: 'Reflective, night-visible'
  }
];

const { logger } = require('../middleware/logger');

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roadlink_demo';
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB');
    
    await StickerTemplate.deleteMany({});
    logger.info('Cleared existing templates');
    
    await StickerTemplate.insertMany(templates);
    logger.info('Inserted new templates');
    
    process.exit(0);
  } catch (err) {
    logger.error(`Error seeding DB: ${err.message}`);
    process.exit(1);
  }
};

seedDB();
