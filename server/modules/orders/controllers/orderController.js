const crypto = require('crypto');
const Order = require('../models/Order');
const StickerTemplate = require('../models/StickerTemplate');
const Vehicle = require('../../../models/Vehicle');
const Razorpay = require('razorpay');
const { generateReceiptPDF } = require('../../../services/pdfService');

// Base pricing config (MVP)
const PRICING = {
  standard: { base: 199 },
  reflective: { base: 299 },
  premium: { base: 399 },
  shipping: 50,
  gstRate: 0.18
};

// Compute pricing helper
const computePricing = (tier) => {
  const basePrice = PRICING[tier].base;
  const shippingFee = PRICING.shipping;
  const gst = Math.round((basePrice + shippingFee) * PRICING.gstRate);
  const total = basePrice + shippingFee + gst;
  return { basePrice, shippingFee, gst, total };
};

exports.getTemplates = async (req, res) => {
  try {
    const { tier } = req.query;
    if (!tier || !['standard', 'reflective'].includes(tier)) {
      return res.status(400).json({ error: 'Valid tier (standard, reflective) is required' });
    }
    const templates = await StickerTemplate.find({ tier, active: true });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { vehicleId, tier, templateSelections, customization } = req.body;
    const userId = req.user.userId; // From auth middleware

    if (!['standard', 'reflective', 'premium'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    let pricing = computePricing(tier);
    
    const vehicle = await Vehicle.findById(vehicleId);
    let isFree = false;
    
    if (vehicle && !vehicle.hasUsedFreeStickerOrder) {
      isFree = true;
      pricing = { basePrice: 0, shippingFee: 0, gst: 0, total: 0 };
    }

    const order = new Order({
      userId,
      vehicleId,
      tier,
      templateSelections: templateSelections || [],
      customization: customization || {},
      pricing,
      paymentStatus: 'pending',
      fulfillmentStatus: 'draft'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, line1, line2, city, state, pincode, phone, saveDefault } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { _id: id, userId: req.user.userId, fulfillmentStatus: 'draft' },
      { 
        shippingAddress: { name, line1, line2, city, state, pincode, phone } 
      },
      { new: true }
    );
    
    if (!order) return res.status(404).json({ error: 'Order not found or not in draft state' });
    
    if (saveDefault) {
      const User = require('../../../models/User');
      await User.findByIdAndUpdate(req.user.userId, {
        $set: { address: { name, line1, line2, city, state, pincode, phone } }
      });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, userId: req.user.userId, fulfillmentStatus: 'draft' })
      .populate('templateSelections.templateId')
      .populate('vehicleId');
    
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Initialize Razorpay
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Return dummy data for frontend testing if keys not present
      return res.json({
        id: `dummy_order_${Date.now()}`,
        amount: order.pricing.total * 100,
        currency: 'INR',
        keyId: 'dummy_key'
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (order.pricing.total === 0) {
      order.paymentStatus = 'paid';
      order.fulfillmentStatus = 'processing';
      
      // Generate Receipt for free order
      try {
        const { generateReceiptPDF } = require('../../../services/pdfService');
        const receiptUrl = await generateReceiptPDF(order);
        order.receiptUrl = receiptUrl;
      } catch (pdfErr) {
        console.error("PDF Generation failed for free order", pdfErr);
      }
      
      await order.save();
      
      const Vehicle = require('../../../models/Vehicle');
      await Vehicle.findByIdAndUpdate(order.vehicleId, { hasUsedFreeStickerOrder: true });
      
      return res.json({
        id: `free_${order._id}`,
        amount: 0,
        currency: 'INR',
        keyId: 'dummy_key',
        isFree: true,
        orderInfo: order
      });
    }

    const options = {
      amount: order.pricing.total * 100,  // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${order._id}`
    };

    const rzpOrder = await instance.orders.create(options);
    
    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.json({
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // Send to frontend to init checkout
      orderInfo: order
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

exports.paymentWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verifying signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Process event
    const event = req.body.event;
    
    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      
      const order = await Order.findOne({ razorpayOrderId }).populate('templateSelections.templateId').populate('vehicleId');
      if (order) {
        order.paymentStatus = 'paid';
        order.fulfillmentStatus = 'processing';
        
        // Generate Receipt
        try {
          const receiptUrl = await generateReceiptPDF(order);
          order.receiptUrl = receiptUrl;
        } catch (pdfErr) {
          console.error("PDF Generation failed", pdfErr);
        }
        
        await order.save();
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      
      const order = await Order.findOne({ razorpayOrderId });
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }
    }
    
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('vehicleId', 'displayName registrationNumber type make model')
      .populate('templateSelections.templateId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('vehicleId', 'displayName registrationNumber type make model')
      .populate('templateSelections.templateId');
      
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReceipt = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('templateSelections.templateId')
      .populate('vehicleId');
      
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Lazy generate if not present
    if (!order.receiptUrl) {
      try {
        const { generateReceiptPDF } = require('../../../services/pdfService');
        const receiptUrl = await generateReceiptPDF(order);
        order.receiptUrl = receiptUrl;
        await order.save();
      } catch (pdfErr) {
        console.error("Lazy PDF Generation failed", pdfErr);
        return res.status(500).json({ error: 'Failed to generate receipt' });
      }
    }
    
    // In local setup, receiptUrl is just /uploads/receipts/filename.pdf
    res.json({ receiptUrl: order.receiptUrl });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.previewCustomization = async (req, res) => {
  // Mock endpoint for Premium Customizer
  try {
    res.json({ previewUrl: 'https://via.placeholder.com/300?text=Premium+Preview' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
