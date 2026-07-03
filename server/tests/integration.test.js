const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Make sure app.js exports the app

// Models
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const QrToken = require('../models/QrToken');
const Report = require('../models/Report');
const OtpSession = require('../models/OtpSession');

let accessToken;
let testVehicleId;
let activeQrToken;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('RoadLink API Integration Tests', () => {
  
  describe('1. Auth Flow', () => {
    const testPhone = '+919999999999';
    const testName = 'Test User';
    
    it('should request OTP successfully', async () => {
      const res = await request(app)
        .post('/v1/auth/otp/request')
        .send({ phone: testPhone, name: testName });
        
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      const session = await OtpSession.findOne({ phone: testPhone });
      expect(session).toBeTruthy();
      expect(session.otp).toBeDefined();
    });

    it('should verify OTP and return tokens', async () => {
      const session = await OtpSession.findOne({ phone: testPhone });
      
      const res = await request(app)
        .post('/v1/auth/otp/verify')
        .send({ phone: testPhone, otp: session.otp });
        
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      
      accessToken = res.body.data.accessToken;
      
      const user = await User.findOne({ phone: testPhone });
      expect(user).toBeTruthy();
      expect(user.role).toBe('owner');
    });
  });

  describe('2. Vehicle & QR Generation Flow', () => {
    it('should create a vehicle and generate QR token simultaneously', async () => {
      const res = await request(app)
        .post('/v1/vehicles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          registrationNumber: 'MH 12 AB 1234', // Spaces should be stripped
          make: 'Honda',
          model: 'City'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicle.registrationNumber).toBe('MH12AB1234');
      expect(res.body.data.qrToken).toBeDefined();
      
      testVehicleId = res.body.data.vehicle._id;
      activeQrToken = res.body.data.qrToken;
      
      const tokenDoc = await QrToken.findOne({ token: activeQrToken });
      expect(tokenDoc).toBeTruthy();
      expect(tokenDoc.vehicleId.toString()).toBe(testVehicleId.toString());
    });
  });

  describe('3. Privacy & Report Submission Flow', () => {
    it('should resolve QR without leaking owner phone number', async () => {
      const res = await request(app)
        .get(`/v1/vehicles/resolve?token=${activeQrToken}`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      const profile = res.body.data.profile;
      expect(profile.vehicleId).toBeDefined();
      expect(profile.publicDisplayName).toBeDefined();
      
      // ENSURE INVARIANT: NO PHONE NUMBER RETURNED
      expect(profile.phone).toBeUndefined();
      expect(profile.ownerPhone).toBeUndefined();
      expect(JSON.stringify(res.body)).not.toContain('+919999999999');
    });

    it('should submit a report using a valid QR token', async () => {
      const res = await request(app)
        .post('/v1/reports')
        .send({
          qrToken: activeQrToken,
          category: 'wrong_parking',
          notes: 'Blocking driveway'
        });
        
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.reportId).toBeDefined();
    });

    it('should reject a report with an invalid or tampered QR token', async () => {
      const tamperedToken = activeQrToken.slice(0, -5) + 'xxxxx';
      
      const res = await request(app)
        .post('/v1/reports')
        .send({
          qrToken: tamperedToken,
          category: 'wrong_parking'
        });
        
      expect([400, 404]).toContain(res.statusCode);
      expect(res.body.success).toBe(false);
    });
  });
});
