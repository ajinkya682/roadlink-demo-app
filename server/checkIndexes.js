require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./modules/orders/models/Order');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const indexes = await Order.collection.indexes();
  console.log("Indexes on orders collection:", indexes);
  process.exit(0);
}
run();
