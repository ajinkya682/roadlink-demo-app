const mongoose = require('mongoose');
const Order = require('./modules/orders/models/Order');

async function test() {
  try {
    const order = new Order({
      userId: "507f1f77bcf86cd799439011",
      vehicleId: "507f1f77bcf86cd799439011",
      tier: "reflective",
      templateSelections: [
        { templateId: "64f0b2c1e4b0a1d2c3e4f5a1", position: "front" },
        { templateId: "64f0b2c1e4b0a1d2c3e4f5a2", position: "back" }
      ],
      customization: {},
      pricing: { basePrice: 0, shippingFee: 0, gst: 0, total: 0 },
      paymentStatus: 'pending',
      fulfillmentStatus: 'draft'
    });
    const error = order.validateSync();
    if (error) console.error(error);
    else console.log("Order is perfectly valid!");
  } catch (e) {
    console.error("Catch:", e);
  }
}
test();
