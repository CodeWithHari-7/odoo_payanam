require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors()); // Allow requests from React frontend
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Log HTTP requests

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Traveloop API is running.' });
});

// We will mount our routes here in later phases

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

module.exports = app;
