const express = require('express');
const router = express.Router();
const { getPendingListings } = require('../controllers/admin.controller');

// GET /api/admin/pending-listings
router.get('/pending-listings', getPendingListings); 

module.exports = router;
