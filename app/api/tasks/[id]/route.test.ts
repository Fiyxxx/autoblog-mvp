import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { restartDay } from '@/lib/tasks'
import { GET } from './route'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('GET /api/tasks/[id]', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('returns 404 for an unknown id', async () => {
    const response = await GET(new Request('http://localhost/api/tasks/unknown'), {
      params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000000' }),
    })
    expect(response.status).toBe(404)
  })

  it('returns the task with its post for a known id', async () => {
    const { taskIds } = await restartDay()
    const response = await GET(new Request(`http://localhost/api/tasks/${taskIds[0]}`), {
      params: Promise.resolve({ id: taskIds[0] }),
    })
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.id).toBe(taskIds[0])
    expect(body.post).not.toBeNull()
  })
})
