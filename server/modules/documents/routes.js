const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { requireAuth, requireOwner } = require('../../middleware/auth');
const multer = require('multer');

// Configure multer for memory storage (uploaded to Cloudinary in controller)
const storage = multer.memoryStorage();

// Max size 10MB per Section 9.3
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG are allowed'));
    }
  }
});

// All document routes require owner auth
router.use(requireAuth, requireOwner);

// The 'file' field matches the form-data key
router.post('/', upload.single('file'), controller.uploadDocument);
router.get('/', controller.getDocuments);
router.patch('/:id', controller.updateDocument);
router.delete('/:id', controller.deleteDocument);

module.exports = router;
