const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const controller = require('./controller');
const { requireAuth } = require('../../middleware/auth');

router.get('/me', requireAuth, controller.getUserProfile);
router.patch('/me', requireAuth, upload.single('file'), controller.updateProfile);
router.delete('/me', requireAuth, controller.deleteAccount);
router.patch('/settings', requireAuth, controller.updateSettings);

router.post('/device-tokens', requireAuth, controller.registerDeviceToken);
router.delete('/device-tokens/:deviceId', requireAuth, controller.deleteDeviceToken);

module.exports = router;
