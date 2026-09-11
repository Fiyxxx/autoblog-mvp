import '@testing-library/jest-dom/vitest'

// Vitest (unlike Next.js) does not load `.env` automatically. Modules such as
// `lib/db.ts` read `process.env.DATABASE_URL` at import time, so it must be
// populated before any test file imports them. Guarded because CI/hosted
// environments may inject env vars directly without a `.env` file present.
try {
  process.loadEnvFile()
} catch {
  // no .env file present — assume env vars are already set (e.g. CI)
}
