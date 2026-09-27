const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function initDatabase() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS releases (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      date TIMESTAMP NOT NULL,
      additional_info TEXT,
      completed_steps JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    console.log("Database ready");
}

module.exports = { pool, initDatabase };