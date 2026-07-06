require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { logger } = require('./middleware/logger');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Prevent Node from aggressively closing idle connections (crucial for SSE)
  server.keepAliveTimeout = 120000; // 120 seconds
  server.headersTimeout = 120000; // 120 seconds
});
