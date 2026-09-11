import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'
import { prisma } from '@/lib/db'
import { createDailyTasks } from '@/lib/tasks'
import { GET } from './route'

async function resetDb() {
  await prisma.blogPost.deleteMany()
  await prisma.task.deleteMany()
}

describe('GET /api/tasks', () => {
  beforeEach(resetDb)
  afterAll(async () => {
    await resetDb()
    await prisma.$disconnect()
  })

  it('returns the seeded tasks with status', async () => {
    await createDailyTasks(new Date())
    const response = await GET()
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(Array.isArray(body.tasks)).toBe(true)
    expect(body.tasks.length).toBeGreaterThan(0)
    expect(body.tasks[0]).toHaveProperty('status')
  })
})
