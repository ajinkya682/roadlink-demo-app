const mongoose = require('mongoose');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Report = require('./models/Report');
const NotificationLog = require('./models/NotificationLog');
const notificationService = require('./modules/reports/notificationService');

require('dotenv').config();

async function runTests() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roadlink-demo');
  console.log('Connected to DB');

  // Clear existing logs for testing
  await NotificationLog.deleteMany({});
  
  // 1. Create a dummy user
  const user = await User.create({
    phone: '1234567890',
    fcmToken: 'valid-token',
    notificationPrefs: {
      push: true,
      sms: true
    }
  });

  // 2. Create a dummy vehicle
  const vehicle = await Vehicle.create({
    ownerId: user._id,
    type: 'car',
    make: 'Toyota',
    model: 'Corolla',
    licensePlate: 'ABC-1234',
    vin: '1234567890',
    color: 'Red'
  });

  console.log('--- Test 1: Standard Flow (Push Enabled) ---');
  let report1 = await Report.create({ vehicleId: vehicle._id, category: 'wrong_parking' });
  await notificationService.orchestrate(report1);
  let logs1 = await NotificationLog.find({ reportId: report1._id });
  console.log('Logs (should be 1 push delivered):', logs1.map(l => `${l.channel}: ${l.status}`));

  console.log('\n--- Test 2: Push Disabled ---');
  user.notificationPrefs.push = false;
  await user.save();
  let report2 = await Report.create({ vehicleId: vehicle._id, category: 'wrong_parking' });
  await notificationService.orchestrate(report2);
  let logs2 = await NotificationLog.find({ reportId: report2._id });
  console.log('Logs (should be 1 sms delivered):', logs2.map(l => `${l.channel}: ${l.status}`));

  console.log('\n--- Test 3: Emergency Override ---');
  user.notificationPrefs.push = false;
  user.notificationPrefs.sms = false;
  await user.save();
  let report3 = await Report.create({ vehicleId: vehicle._id, category: 'emergency' });
  await notificationService.orchestrate(report3);
  let logs3 = await NotificationLog.find({ reportId: report3._id });
  console.log('Logs (should be push and sms delivered):', logs3.map(l => `${l.channel}: ${l.status}`));

  console.log('\n--- Test 4: Push Failure Fallback ---');
  user.notificationPrefs.push = true;
  user.notificationPrefs.sms = true;
  user.fcmToken = 'fail-token'; // This will cause pushAdapter to fail
  await user.save();
  let report4 = await Report.create({ vehicleId: vehicle._id, category: 'wrong_parking' });
  await notificationService.orchestrate(report4);
  let logs4 = await NotificationLog.find({ reportId: report4._id });
  console.log('Logs (should be push failed, push failed (retry), sms delivered):', logs4.map(l => `${l.channel}: ${l.status}`));

  console.log('\n--- Cleanup ---');
  await User.findByIdAndDelete(user._id);
  await Vehicle.findByIdAndDelete(vehicle._id);
  await Report.deleteMany({ _id: { $in: [report1._id, report2._id, report3._id, report4._id] } });
  
  console.log('Done!');
  mongoose.disconnect();
}

runTests().catch(console.error);
