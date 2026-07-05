require('dotenv').config();
const jwt = require('jsonwebtoken');
const http = require('http');

const token = jwt.sign({ id: "6a4a0f3a6a11ea7ef7050d1e" }, process.env.JWT_SECRET, { expiresIn: '1h' });

const postData = JSON.stringify({
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
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/v1/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => { console.log('BODY:', body); });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
