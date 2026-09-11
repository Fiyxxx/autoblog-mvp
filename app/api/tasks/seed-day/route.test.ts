import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from '@/lib/db'
import { POST } from './route'

async function resetDb() {
  await prisma.blogPost.deleteMany()
  await prisma.task.deleteMany()
}

describe('POST /api/tasks/seed-day', () => {
  beforeEach(resetDb)
  afterAll(async () => {
    await resetDb()
    await prisma.$disconnect()
  })

  it('creates tasks on first call and is a no-op on the second', async () => {
    const first = await POST()
    const firstBody = await first.json()
    expect(firstBody.created).toBe(true)

    const second = await POST()
    const secondBody = await second.json()
    expect(secondBody.created).toBe(false)
    expect(secondBody.taskIds).toEqual(firstBody.taskIds)
  })
})
