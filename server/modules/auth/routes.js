const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { requireAuth } = require('../../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting on OTP requests
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Increased for testing
  message: 'Too many OTP requests from this IP'
});

router.post('/otp/request', otpLimiter, controller.requestOtp);
router.post('/otp/verify', controller.verifyOtp);
router.post('/refresh', controller.refresh);
router.post('/logout', requireAuth, controller.logout);

module.exports = router;
