import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { restartDay } from '@/lib/tasks'
import { GET } from './route'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('GET /api/tasks', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('returns the seeded tasks with status', async () => {
    await restartDay(new Date())
    const response = await GET()
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(Array.isArray(body.tasks)).toBe(true)
    expect(body.tasks.length).toBeGreaterThan(0)
    expect(body.tasks[0]).toHaveProperty('status')
  })
})
