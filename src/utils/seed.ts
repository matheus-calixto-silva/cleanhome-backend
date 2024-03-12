import { Pool, PoolClient } from 'pg';
import { PG_URI } from './config';

const pool = new Pool({
  connectionString: PG_URI,
});

async function createClientsTable() {
  try {
    const client: PoolClient = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(255) NOT NULL,
        coordinate_x numeric NOT NULL,
        coordinate_y numeric NOT NULL
      )
    `);
    console.log('Clients table created successfully');
  } catch (err: unknown) {
    let errorMessage = 'Error creating the clients table.';
    if (err instanceof Error) {
      errorMessage += ' Error: ' + err.message;
    }
    console.error(errorMessage);
  }
}

async function seedClientsTable() {
  try {
    const client: PoolClient = await pool.connect();
    await client.query(`
      INSERT INTO clients (name, username, email, phone, coordinate_x, coordinate_y)
      VALUES
        ('User 1', 'user1', 'user1@example.com', '81 9 8888-8888', 12.34, 56.78),
        ('User 2', 'user2', 'user2@example.com', '81 9 7777-7777', 15.88, 34.87)
    `);
    console.log('Data seeded successfully');
  } catch (err: unknown) {
    let errorMessage = 'Error seeding the clients table.';
    if (err instanceof Error) {
      errorMessage += ' Error: ' + err.message;
    }
    console.error(errorMessage);
  }
}

createClientsTable();
seedClientsTable();
