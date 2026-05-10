const express = require('express');
const router = express.Router();
const { getNotes, createNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:tripId', protect, getNotes);
router.post('/', protect, createNote);

module.exports = router;
