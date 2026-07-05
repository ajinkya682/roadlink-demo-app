const crypto = require('crypto');
const Razorpay = require('razorpay');
const Vehicle = require('../../../models/Vehicle');
const QrToken = require('../../../models/QrToken');
const Order = require('../../orders/models/Order');
const { generateQRToken } = require('../../../utils/hmac');
const { sendSuccess, sendError } = require('../../../utils/response');
const { logger } = require('../../../middleware/logger');

exports.createSubscription = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const userId = req.user.userId || req.user.id;

    const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: userId });
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);

    if (vehicle.protectionStatus === 'active') {
      return sendError(res, 'Vehicle is already active and protected', 400);
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Mock mode
      const mockId = `sub_mock_${Date.now()}`;
      vehicle.razorpaySubscriptionId = mockId;
      await vehicle.save();
      
      return sendSuccess(res, {
        subscriptionId: mockId,
        keyId: 'dummy_key',
        amount: 29900
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const planId = process.env.RAZORPAY_PLAN_ID || 'plan_default';

    if (planId === 'plan_default') {
      const mockId = `sub_mock_${Date.now()}`;
      vehicle.razorpaySubscriptionId = mockId;
      
      // Auto-activate in mock mode since there's no webhook
      vehicle.protectionStatus = 'active';
      const now = new Date();
      vehicle.currentPeriodStart = now;
      vehicle.currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      vehicle.refundGuaranteeExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      await vehicle.save();
      
      // Generate QR token
      await QrToken.updateMany({ vehicleId: vehicle._id }, { $set: { active: false } });
      const tokenStr = generateQRToken(vehicle._id.toString());
      await new QrToken({ vehicleId: vehicle._id, token: tokenStr }).save();
      
      return sendSuccess(res, {
        subscriptionId: mockId,
        keyId: 'dummy_key',
        amount: 29900
      });
    }

    const options = {
      plan_id: planId,
      customer_notify: 1,
      total_count: 120, // Recurring up to 10 years
      notes: {
        vehicleId: vehicle._id.toString(),
        userId: userId.toString()
      }
    };

    const subscription = await instance.subscriptions.create(options);

    vehicle.razorpaySubscriptionId = subscription.id;
    await vehicle.save();

    return sendSuccess(res, {
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: 29900 // UI display hint
    });
  } catch (error) {
    logger.error('Failed to create Razorpay subscription:', error);
    return sendError(res, 'Failed to create subscription', 500);
  }
};

exports.webhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verifying signature
    if (secret) {
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');

      if (digest !== req.headers['x-razorpay-signature']) {
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    const event = req.body.event;
    
    if (event === 'subscription.activated' || event === 'subscription.charged') {
      const subEntity = req.body.payload.subscription.entity;
      const vehicleId = subEntity.notes?.vehicleId;
      
      if (vehicleId) {
        const vehicle = await Vehicle.findById(vehicleId);
        if (vehicle) {
          if (vehicle.protectionStatus !== 'active') {
             await QrToken.updateMany({ vehicleId }, { $set: { active: false } });
             const tokenStr = generateQRToken(vehicle._id.toString());
             const qrToken = new QrToken({
               vehicleId: vehicle._id,
               token: tokenStr
             });
             await qrToken.save();
             
             const now = new Date();
             const refundGuaranteeExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
             
             vehicle.protectionStatus = 'active';
             vehicle.currentPeriodStart = new Date(subEntity.current_start * 1000);
             vehicle.currentPeriodEnd = new Date(subEntity.current_end * 1000);
             vehicle.refundGuaranteeExpiresAt = refundGuaranteeExpiresAt;
             await vehicle.save();
             
             logger.info(`Vehicle ${vehicleId} activated successfully.`);
          } else {
             vehicle.currentPeriodStart = new Date(subEntity.current_start * 1000);
             vehicle.currentPeriodEnd = new Date(subEntity.current_end * 1000);
             vehicle.protectionStatus = 'active'; 
             await vehicle.save();
          }
        }
      }
    } else if (event === 'subscription.halted' || event === 'subscription.cancelled') {
      const subEntity = req.body.payload.subscription.entity;
      const vehicleId = subEntity.notes?.vehicleId;
      if (vehicleId) {
        const vehicle = await Vehicle.findById(vehicleId);
        if (vehicle) {
          vehicle.protectionStatus = 'lapsed';
          await vehicle.save();
        }
      }
    }
    
    res.json({ status: 'ok' });
  } catch (error) {
    logger.error('Webhook processing failed:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

exports.cancelAndRefund = async (req, res) => {
  try {
    const { id } = req.params; // vehicle id
    const userId = req.user.userId || req.user.id;
    
    const vehicle = await Vehicle.findOne({ _id: id, ownerId: userId });
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);
    
    if (!vehicle.refundGuaranteeExpiresAt || new Date() > vehicle.refundGuaranteeExpiresAt) {
      return sendError(res, 'Refund guarantee window has expired', 400);
    }
    
    let stickerOrderShipped = false;
    if (vehicle.hasUsedFreeStickerOrder) {
      const order = await Order.findOne({ vehicleId: id, 'pricing.total': 0 });
      if (order && ['shipped', 'delivered'].includes(order.fulfillmentStatus)) {
        stickerOrderShipped = true;
      }
    }
    
    if (stickerOrderShipped) {
       return sendError(res, 'Cannot refund because your free stickers have already been shipped. You can still cancel future renewals.', 400);
    }
    
    if (vehicle.razorpaySubscriptionId && !vehicle.razorpaySubscriptionId.startsWith('sub_mock')) {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      try {
        await instance.subscriptions.cancel(vehicle.razorpaySubscriptionId, false);
      } catch (err) {
        logger.error('Failed to cancel subscription at Razorpay:', err);
      }
    }
    
    vehicle.protectionStatus = 'pending_payment';
    vehicle.hasUsedFreeStickerOrder = false;
    vehicle.razorpaySubscriptionId = null;
    await vehicle.save();
    
    await QrToken.updateMany({ vehicleId: id }, { $set: { active: false, revokedAt: new Date() } });
    
    return sendSuccess(res, { message: 'Subscription cancelled and refunded successfully. Vehicle protection is now pending.' });
  } catch (error) {
    logger.error('Refund cancellation error:', error);
    return sendError(res, 'Failed to process refund cancellation', 500);
  }
};

exports.verifySubscription = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, vehicleId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_payment_id + '|' + razorpay_subscription_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return sendError(res, 'Invalid signature', 400);
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);

    if (vehicle.protectionStatus !== 'active') {
      await QrToken.updateMany({ vehicleId: vehicle._id }, { $set: { active: false } });
      const tokenStr = generateQRToken(vehicle._id.toString());
      const qrToken = new QrToken({
        vehicleId: vehicle._id,
        token: tokenStr
      });
      await qrToken.save();
      
      const now = new Date();
      const refundGuaranteeExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      vehicle.protectionStatus = 'active';
      vehicle.currentPeriodStart = now;
      vehicle.currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      vehicle.refundGuaranteeExpiresAt = refundGuaranteeExpiresAt;
      await vehicle.save();
    }

    return sendSuccess(res, { message: 'Subscription verified and activated successfully.' });
  } catch (error) {
    logger.error('Manual verification failed:', error);
    return sendError(res, 'Failed to verify subscription', 500);
  }
};
