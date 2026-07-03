const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { requireAuth, requireOwner } = require('../../middleware/auth');

router.use(requireAuth, requireOwner);

router.post('/', controller.addContact);
router.get('/', controller.getContacts);
router.patch('/:id', controller.updateContact);
router.delete('/:id', controller.deleteContact);

module.exports = router;
