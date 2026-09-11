import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { restartDay } from '@/lib/tasks'
import { TOPICS } from '@/lib/content-generator'
import { GET } from './route'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('GET /api/runs/[id]/posts', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it("lists a run's posts with their archived state", async () => {
    const run = await restartDay(new Date('2026-01-01T09:00:00Z'))

    const response = await GET(new Request('http://localhost/api/runs/x/posts'), {
      params: Promise.resolve({ id: run.runId }),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.posts.length).toBe(TOPICS.length)
    expect(body.posts.every((p: { archived: boolean }) => p.archived === false)).toBe(true)
  })

  it('returns 404 for an unknown run', async () => {
    const response = await GET(new Request('http://localhost/api/runs/missing/posts'), {
      params: Promise.resolve({ id: 'missing' }),
    })

    expect(response.status).toBe(404)
  })
})
