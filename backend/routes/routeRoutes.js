const express = require('express');
const router = express.Router();
const { getRoutes, searchRoutes, getSchedules } = require('../controllers/routeController');

// Define specific routes first before parameterized routes
router.get('/search', searchRoutes);
router.get('/', getRoutes);
router.get('/:routeId/schedules', getSchedules);

module.exports = router;
