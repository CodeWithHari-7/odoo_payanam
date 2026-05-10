const pool = require('../config/db');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res, next) => {
  try {
    const { title, destination, start_date, end_date } = req.body;
    const userId = req.user.id;

    if (!title || !destination || !start_date || !end_date) {
      res.status(400);
      throw new Error('Please include all fields');
    }

    // Begin transaction
    await pool.query('BEGIN');

    // Create Trip
    const newTrip = await pool.query(
      'INSERT INTO trips (owner_id, title, destination, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, destination, start_date, end_date]
    );
    const trip = newTrip.rows[0];

    // Add owner as a trip member
    await pool.query(
      "INSERT INTO trip_members (trip_id, user_id, role) VALUES ($1, $2, 'OWNER')",
      [trip.id, userId]
    );

    await pool.query('COMMIT');

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
};

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const trips = await pool.query(`
      SELECT t.* FROM trips t
      JOIN trip_members tm ON t.id = tm.trip_id
      WHERE tm.user_id = $1
      ORDER BY t.created_at DESC
    `, [userId]);

    res.status(200).json({ success: true, data: trips.rows });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip details
// @route   GET /api/trips/:id
// @access  Private
const getTrip = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;

    // Verify membership
    const memberCheck = await pool.query(
      'SELECT * FROM trip_members WHERE trip_id = $1 AND user_id = $2',
      [tripId, userId]
    );

    if (memberCheck.rows.length === 0) {
      res.status(403);
      throw new Error('Not authorized to view this trip');
    }

    const trip = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);

    res.status(200).json({ success: true, data: trip.rows[0] });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;
    const { title, destination, start_date, end_date } = req.body;

    // Check if user is owner
    const tripQuery = await pool.query('SELECT * FROM trips WHERE id = $1 AND owner_id = $2', [tripId, userId]);
    if (tripQuery.rows.length === 0) {
      res.status(403);
      throw new Error('Not authorized or trip not found');
    }

    const updatedTrip = await pool.query(
      'UPDATE trips SET title = COALESCE($1, title), destination = COALESCE($2, destination), start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date) WHERE id = $5 RETURNING *',
      [title, destination, start_date, end_date, tripId]
    );

    res.status(200).json({ success: true, data: updatedTrip.rows[0] });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;

    const tripQuery = await pool.query('SELECT * FROM trips WHERE id = $1 AND owner_id = $2', [tripId, userId]);
    if (tripQuery.rows.length === 0) {
      res.status(403);
      throw new Error('Not authorized or trip not found');
    }

    await pool.query('DELETE FROM trips WHERE id = $1', [tripId]);
    res.status(200).json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTrip, getTrips, getTrip, updateTrip, deleteTrip };
