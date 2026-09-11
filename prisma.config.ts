import { defineConfig, env } from 'prisma/config'

// Guarded: CI/hosted environments may inject DATABASE_URL directly without a
// physical `.env` file present, in which case this would throw ENOENT.
try {
  process.loadEnvFile()
} catch {
  // no .env file present — assume env vars are already set (e.g. CI)
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
