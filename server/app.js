const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { logger, requestLogger } = require('./middleware/logger');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging (PII redacted)
app.use(requestLogger);

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Module routes will be mounted here
app.use('/v1/auth', require('./modules/auth/routes'));
app.use('/v1/vehicles', require('./modules/vehicles/routes'));
app.use('/v1/reports', require('./modules/reports/routes'));
app.use('/v1/documents', require('./modules/documents/routes'));
app.use('/v1/emergency-contacts', require('./modules/contacts/routes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'OK' } });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Server Error'
    }
  });
});

module.exports = app;
