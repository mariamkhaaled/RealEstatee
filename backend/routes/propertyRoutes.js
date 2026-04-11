const express = require('express');
const propertyController = require('../controllers/propertyController');
const router = express.Router();

router.get('/', propertyController.getAllProperties);
router.post('/', propertyController.createProperty);

module.exports = router;