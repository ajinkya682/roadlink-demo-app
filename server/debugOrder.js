require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./modules/orders/models/Order');
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');
const orderController = require('./modules/orders/controllers/orderController');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const req = {
    body: {
      vehicleId: "6a4a1298fbe335935a88c5b1",
      tier: "reflective",
      templateSelections: [
        {
          templateId: "64f0b2c1e4b0a1d2c3e4f5a2",
          position: "front",
          previewImageUrl: "/src/assets/images/stickers/reflective-halo-ring.png"
        },
        {
          templateId: "64f0b2c1e4b0a1d2c3e4f5a3",
          position: "back",
          previewImageUrl: "/src/assets/images/stickers/reflective-hazard-accent.png"
        }
      ],
      customization: {}
    },
    user: {
      id: "6a4a0f3a6a11ea7ef7050d1e"
    }
  };

  const res = {
    status: (code) => {
      console.log("Status:", code);
      return {
        json: (data) => {
          console.log("Response:", data);
        }
      }
    }
  };

  await orderController.createOrder(req, res);
  process.exit(0);
}
run();
