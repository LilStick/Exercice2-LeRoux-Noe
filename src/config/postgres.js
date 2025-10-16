const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});

const initPostgres = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks_pg (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('PostgreSQL connected and table ready');
  } catch (error) {
    console.error('PostgreSQL error:', error);
  }
};

module.exports = { pool, initPostgres };
