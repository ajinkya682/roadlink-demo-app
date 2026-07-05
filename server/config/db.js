const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const { logger } = require('../middleware/logger');
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roadlink');
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const { logger } = require('../middleware/logger');
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
