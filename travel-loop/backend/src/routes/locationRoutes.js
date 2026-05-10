const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// GET /api/locations/suggest
router.get('/suggest', locationController.suggestLocation);

// GET /api/locations/reverse
router.get('/reverse', locationController.reverseGeocode);

module.exports = router;
