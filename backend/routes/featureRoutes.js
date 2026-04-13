const express = require('express');
const featureController = require('../controllers/featureController');

const router = express.Router();

router.get('/', featureController.getAllFeatures);

module.exports = router;