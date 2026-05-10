const express = require('express');
const router = express.Router();
const { createTrip, getTrips, getTrip, updateTrip, deleteTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTrip)
  .get(protect, getTrips);

router.route('/:id')
  .get(protect, getTrip)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

module.exports = router;
