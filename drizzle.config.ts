import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/backend/db/schema/index.ts',
  dbCredentials: {
    url: "postgresql://lusivelin:RxyEPFa13khS@ep-holy-leaf-a1ikno1f.ap-southeast-1.aws.neon.tech/cemis?sslmode=require",
  }
})
