import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from '@/lib/db'
import { createDailyTasks } from '@/lib/tasks'
import { GET } from './route'

async function resetDb() {
  await prisma.blogPost.deleteMany()
  await prisma.task.deleteMany()
}

describe('GET /api/tasks/[id]', () => {
  beforeEach(resetDb)
  afterAll(async () => {
    await resetDb()
    await prisma.$disconnect()
  })

  it('returns 404 for an unknown id', async () => {
    const response = await GET(new Request('http://localhost/api/tasks/unknown'), {
      params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000000' }),
    })
    expect(response.status).toBe(404)
  })

  it('returns the task with its post for a known id', async () => {
    const { taskIds } = await createDailyTasks()
    const response = await GET(new Request(`http://localhost/api/tasks/${taskIds[0]}`), {
      params: Promise.resolve({ id: taskIds[0] }),
    })
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.id).toBe(taskIds[0])
    expect(body.post).not.toBeNull()
  })
})
