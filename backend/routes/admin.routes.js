const express = require('express');
const router = express.Router();
// 1. Import the new function here
const { getPendingListings, getDashboardStats } = require('../controllers/admin.controller'); 

// GET /api/admin/pending-listings
router.get('/pending-listings', getPendingListings); 

// 2. Add the new stats route
// GET /api/admin/stats
router.get('/stats', getDashboardStats);

module.exports = router;
