const express = require('express');
const router = express.Router();
const { getChecklist, createChecklistTask } = require('../controllers/checklistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:tripId', protect, getChecklist);
router.post('/', protect, createChecklistTask);

module.exports = router;
