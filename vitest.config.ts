import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    passWithNoTests: true,
    // Integration tests in lib/tasks.test.ts and lib/posts.test.ts share a
    // real Postgres database and reset shared tables in beforeEach/afterAll.
    // Running test files in parallel workers races against that shared
    // state, so files run sequentially instead.
    fileParallelism: false,
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
})
