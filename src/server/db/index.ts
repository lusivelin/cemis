import dotenv from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
const sslCert = process.env.SUPABASE_CA_CERT?.replace(/\\n/g, '\n');

if (!connectionString || !sslCert) {
  throw new Error('DATABASE_URL must be set');
}

const pool = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: {
    ca: sslCert,
    rejectUnauthorized: process.env.NODE_ENV === 'production',
    require: process.env.NODE_ENV === 'production',
  },
  connection: {
    application_name: 'actxplorer',
    keepalive: true,
  },
});

export const db = drizzle(pool, { schema });

process.on('SIGTERM', async () => {
  try {
    await pool.end();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
  process.exit(0);
});
