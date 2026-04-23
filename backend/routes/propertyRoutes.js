const express = require('express');
const propertyController = require('../controllers/propertyController');
const upload = require('../middleware/upload');

const router = express.Router();
// Add updateListingStatus to your imports at the top
const { updateListingStatus } = require('../controllers/propertyController');

// Add this route with your other property routes
router.patch('/listing-status/:listingId', updateListingStatus);


router.get('/', propertyController.getAllProperties);
router.post('/', upload.array('images', 10), propertyController.createProperty);
router.get('/owner/:ownerId', propertyController.getOwnerProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', upload.array('images', 10), propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);
module.exports = router;