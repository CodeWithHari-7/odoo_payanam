const pool = require('../config/db');

// Helper to check membership
const checkMembership = async (tripId, userId) => {
  const result = await pool.query('SELECT * FROM trip_members WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
  return result.rows.length > 0;
};

// @desc    Get stops for a trip
// @route   GET /api/stops/:tripId
// @access  Private
const getStops = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    if (!(await checkMembership(tripId, req.user.id))) {
      res.status(403);
      throw new Error('Not authorized to view this trip');
    }

    const stops = await pool.query('SELECT * FROM stops WHERE trip_id = $1 ORDER BY arrival_time ASC', [tripId]);
    res.status(200).json({ success: true, data: stops.rows });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a stop
// @route   POST /api/stops
// @access  Private
const createStop = async (req, res, next) => {
  try {
    const { trip_id, name, lat, lng, arrival_time, departure_time } = req.body;

    if (!trip_id || !name) {
      res.status(400);
      throw new Error('trip_id and name are required');
    }

    if (!(await checkMembership(trip_id, req.user.id))) {
      res.status(403);
      throw new Error('Not authorized to modify this trip');
    }

    const newStop = await pool.query(
      'INSERT INTO stops (trip_id, name, lat, lng, arrival_time, departure_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [trip_id, name, lat, lng, arrival_time, departure_time]
    );

    res.status(201).json({ success: true, data: newStop.rows[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStops, createStop };
