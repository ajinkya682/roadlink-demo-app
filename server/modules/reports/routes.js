const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { requireAuth, requireOwner } = require('../../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for guest report submissions (max 10/hour)
const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many reports submitted. Please try again later.',
  skip: (req, res) => {
    // Exempt emergency/theft categories from rate limiting
    return req.body.category === 'emergency' || req.body.category === 'theft';
  }
});

// Guest endpoint
router.post('/', reportLimiter, controller.createReport);

// Owner endpoints
router.use(requireAuth, requireOwner);
router.get('/', controller.getReports);
router.patch('/:id', controller.updateReport);

module.exports = router;
