import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { Client } from '../types';
import { pool } from '../utils/config';

export const getAllClients = async (_req: Request, res: Response) => {
  try {
    const client: PoolClient = await pool.connect();
    const result = await client.query(`
      SELECT * FROM clients
    `);

    const clients: Client[] = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      phone: row.phone,
      coordinateX: row.coordinate_x, // Using coordinateX for clarity
      coordinateY: row.coordinate_y,
    }));

    return res.status(200).json(clients);
  } catch (err: unknown) {
    let errorMessage = 'Error fetching all clients.';
    if (err instanceof Error) {
      errorMessage += ' Error: ' + err.message;
    }
    console.error(errorMessage);
    throw err; // Re-throw the error for handling in the calling code
  }
};

export const createNewClient = async (req: Request, res: Response) => {
  try {
    const { name, username, email, phone, coordinateX, coordinateY } = req.body;

    // Input validation (optional but recommended)
    if (
      !name ||
      !username ||
      !email ||
      !phone ||
      !coordinateX ||
      !coordinateY
    ) {
      return res
        .status(400)
        .json({ message: 'Missing required client information.' });
    }

    const client: PoolClient = await pool.connect();
    const result = await client.query(
      `
      INSERT INTO clients (name, username, email, phone, coordinate_x, coordinate_y)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [name, username, email, phone, coordinateX, coordinateY],
    );

    const newClient = result.rows[0];

    return res.status(201).json(newClient);
  } catch (err) {
    let errorMessage = 'Error creating new client.';
    if (err instanceof Error) {
      errorMessage += ' Error: ' + err.message;
    }
    console.error(errorMessage);
    throw err; // Re-throw the error for handling in the calling code
  }
};

const calculateDistance = (client: Client): number => {
  return Math.sqrt(client.coordinateX ** 2 + client.coordinateY ** 2);
};

export const sortByDistanceToOrigin = (clients: Client[]): Client[] => {
  return clients.sort((a, b) => {
    const distanceA = calculateDistance(a);
    const distanceB = calculateDistance(b);

    if (distanceA < distanceB) {
      return -1;
    } else if (distanceA > distanceB) {
      return 1;
    } else {
      return 0;
    }
  });
};

export const getClientsByLocation = async (_req: Request, res: Response) => {
  try {
    const client: PoolClient = await pool.connect();
    const result = await client.query(`
      SELECT * FROM clients
    `);

    const clients: Client[] = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      phone: row.phone,
      coordinateX: row.coordinate_x, // Using coordinateX for clarity
      coordinateY: row.coordinate_y,
    }));

    const orderedClients = sortByDistanceToOrigin(clients);

    return res.status(200).json(orderedClients);
  } catch (err: unknown) {
    let errorMessage = 'Error fetching all clients.';
    if (err instanceof Error) {
      errorMessage += ' Error: ' + err.message;
    }
    console.error(errorMessage);
    throw err; // Re-throw the error for handling in the calling code
  }
};
