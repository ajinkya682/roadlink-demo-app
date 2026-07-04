const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { requireAuth } = require('../../middleware/auth');

router.get('/me', requireAuth, controller.getUserProfile);
router.patch('/settings', requireAuth, controller.updateSettings);

module.exports = router;
