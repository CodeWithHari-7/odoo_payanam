const pool = require('../config/db');

// @desc    Get activities for a stop
// @route   GET /api/activities/:stopId
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    const { stopId } = req.params;

    // Optional: could add membership check via joins, but assuming client calls this within trip context
    const activities = await pool.query('SELECT * FROM activities WHERE stop_id = $1 ORDER BY created_at ASC', [stopId]);
    
    res.status(200).json({ success: true, data: activities.rows });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res, next) => {
  try {
    const { stop_id, name, description, lat, lng, cost } = req.body;

    if (!stop_id || !name) {
      res.status(400);
      throw new Error('stop_id and name are required');
    }

    const newActivity = await pool.query(
      'INSERT INTO activities (stop_id, name, description, lat, lng, cost) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [stop_id, name, description, lat, lng, cost || 0.00]
    );

    res.status(201).json({ success: true, data: newActivity.rows[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivities, createActivity };
