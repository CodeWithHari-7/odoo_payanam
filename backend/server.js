const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/tripRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Traveloop API!' });
});

// Route registration
app.use('/api/trips', tripRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong on the server!'
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
