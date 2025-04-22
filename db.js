const { Pool } = require('pg');
require('dotenv').config();  // read DATABASE_URL from environment variable

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;

export default pool;
