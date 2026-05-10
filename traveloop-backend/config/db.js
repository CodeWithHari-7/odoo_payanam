const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool optimized for Supabase PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase external connections
  },
  // Connection pool optimizations for serverless/Supabase environments
  max: 20, // Max number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
});

// Async connection handling and error reporting
pool.on('connect', () => {
  console.log('✅ Successfully connected to Supabase PostgreSQL Database');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client (Supabase DB Error)', err);
  // Optional: In a highly resilient system, you might want to restart the process
  // process.exit(-1);
});

module.exports = pool;
