const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pooling optimized for Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required to connect to Render databases
  }
});

// Async connection handling and error reporting
pool.on('connect', () => {
  console.log('✅ Connected to Render PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
