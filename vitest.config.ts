import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
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
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
