import 'dotenv/config';
import { Pool } from 'pg';

export const PG_URI = process.env.PG_URI as string;

export const PORT = process.env.PORT as string;

export const pool = new Pool({
  connectionString: PG_URI,
});
