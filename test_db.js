const mongoose = require('mongoose');
const Vehicle = require('./server/models/Vehicle');
require('dotenv').config({ path: './server/.env' });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roadlink').then(async () => {
  const vehicles = await Vehicle.find().lean();
  console.log(JSON.stringify(vehicles, null, 2));
  process.exit(0);
});
