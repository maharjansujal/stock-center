// scripts/migrate.js
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required by Neon cloud connections
});

async function runMigrations() {
  try {
    const sqlPath = path.join(__dirname, "../src/db/schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Connecting to Neon and applying schema changes...");
    await pool.query(sql);
    console.log("Database tables initialized successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

runMigrations();
