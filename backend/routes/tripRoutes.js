const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/trips
router.post('/', async (req, res, next) => {
  try {
    const { title, destination, start_date, end_date } = req.body;
    
    // Validation
    if (!title || !destination || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, destination, start_date, and end_date.'
      });
    }

    // PostgreSQL INSERT query
    const newTrip = await pool.query(
      'INSERT INTO trips (title, destination, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, destination, start_date, end_date]
    );

    // Proper JSON response
    res.status(201).json({
      success: true,
      data: newTrip.rows[0]
    });

  } catch (error) {
    // Pass errors to the centralized error handler in server.js
    next(error);
  }
});

module.exports = router;
