const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { requireAuth } = require('../../../middleware/auth');

// Protected routes (requires user to be logged in)
router.post('/create', requireAuth, subscriptionController.createSubscription);
router.post('/cancel-refund/:id', requireAuth, subscriptionController.cancelAndRefund);
router.post('/verify', requireAuth, subscriptionController.verifySubscription);

// Public webhook route (Razorpay sends this, uses signature validation)
router.post('/webhook', subscriptionController.webhook);

module.exports = router;
