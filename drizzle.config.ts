import dotenv from 'dotenv'
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: '.env.local' });

const url = process.env.DATABASE_URL!;

if(!url) {
  throw new Error('DATABASE_URL must be set');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/server/db/schema/index.ts',
  dbCredentials: {
    url,
  },
  schemaFilter: ["public"],
})
