const express = require('express');
const router = express.Router();
const { getStops, createStop } = require('../controllers/stopController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:tripId', protect, getStops);
router.post('/', protect, createStop);

module.exports = router;
