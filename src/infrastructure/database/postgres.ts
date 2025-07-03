import { Pool } from "pg";

export const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
});

// Create tables if they don't exist
export async function initializeDatabase() {
	const client = await pool.connect();
	try {
		await client.query(`
      CREATE TABLE IF NOT EXISTS jokes (
        id SERIAL PRIMARY KEY,
        value TEXT NOT NULL,
        source VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
	} finally {
		client.release();
	}
}
