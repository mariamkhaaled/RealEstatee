const express = require('express');
const propertyController = require('../controllers/propertyController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', propertyController.getAllProperties);
router.post('/', upload.array('images', 10), propertyController.createProperty);
router.get('/owner/:ownerId', propertyController.getOwnerProperties);
router.get('/:id', propertyController.getPropertyById);
module.exports = router;