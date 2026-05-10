const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Regular user routes
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes (would typically be in a separate adminRoutes.js, but placed here for simplicity as requested)
router.get('/all', protect, admin, getAllBookings);

module.exports = router;
