const express = require('express');
const router = express.Router();
const controller = require('./controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { requireAuth, requireOwner } = require('../../middleware/auth');

// Guest endpoints (No auth)
router.get('/resolve', controller.resolveQR);
router.get('/search', controller.searchVehicle);

// Owner endpoints
router.use(requireAuth, requireOwner);

router.post('/', upload.single('image'), controller.createVehicle);
router.get('/', controller.getVehicles);
router.get('/:id', controller.getVehicleById);
router.patch('/:id', controller.updateVehicle);
router.delete('/:id', controller.deleteVehicle);
router.post('/:id/qr/regenerate', controller.regenerateQR);

module.exports = router;
