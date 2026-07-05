const mongoose = require('mongoose');
const Order = require('./modules/orders/models/Order');

async function test() {
  try {
    const order = new Order({
      userId: "507f1f77bcf86cd799439011",
      vehicleId: "507f1f77bcf86cd799439011",
      tier: "reflective",
      templateSelections: [],
      customization: {},
      pricing: { basePrice: 0, shippingFee: 0, gst: 0, total: 0 },
      paymentStatus: 'pending',
      fulfillmentStatus: 'draft'
    });
    const error = order.validateSync();
    if (error) {
      console.error("Validation failed:", error.message);
    } else {
      console.log("Order is valid");
    }
  } catch (e) {
    console.error("Catch:", e);
  }
}
test();
