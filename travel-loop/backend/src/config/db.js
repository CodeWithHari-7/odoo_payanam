const { Pool } = require('pg');
require('dotenv').config();

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For local development, ssl might not be needed. 
  // In production (Render), you often need:
  // ssl: { rejectUnauthorized: false }
});

// Test the connection
pool.on('connect', () => {
  console.log('🔗 Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
