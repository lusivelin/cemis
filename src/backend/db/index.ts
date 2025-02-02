import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connectionString =
  'postgresql://lusivelin:RxyEPFa13khS@ep-holy-leaf-a1ikno1f.ap-southeast-1.aws.neon.tech/cemis?sslmode=require';
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool, { schema });
