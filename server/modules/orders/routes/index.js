const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../middleware/auth');
const orderController = require('../controllers/orderController');

// Template routes
router.get('/sticker-templates', requireAuth, orderController.getTemplates);

// Order routes
router.post('/orders', requireAuth, orderController.createOrder);
router.patch('/orders/:id/address', requireAuth, orderController.updateAddress);
router.post('/orders/:id/checkout', requireAuth, orderController.checkout);
router.post('/orders/payment-webhook', orderController.paymentWebhook); // No auth, verified by signature
router.get('/orders', requireAuth, orderController.getOrderHistory);
router.get('/orders/:id', requireAuth, orderController.getOrderDetail);
router.get('/orders/:id/receipt', requireAuth, orderController.getReceipt);
router.post('/orders/:id/customization/preview', requireAuth, orderController.previewCustomization);

module.exports = router;
