import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from '@/lib/db'
import { POST } from './route'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('POST /api/tasks/restart-day', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('creates a new run with a fresh batch of tasks and posts', async () => {
    const response = await POST()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(typeof body.runId).toBe('string')
    expect(body.taskIds.length).toBeGreaterThan(0)

    const tasks = await prisma.task.findMany({ where: { runId: body.runId } })
    expect(tasks.length).toBe(body.taskIds.length)

    const posts = await prisma.blogPost.count()
    expect(posts).toBe(body.taskIds.length)
  })

  it('does not delete prior runs — calling it twice accumulates tasks under two runs', async () => {
    const first = await POST()
    const firstBody = await first.json()

    const second = await POST()
    const secondBody = await second.json()

    expect(secondBody.runId).not.toBe(firstBody.runId)

    const allTasks = await prisma.task.findMany()
    expect(allTasks.length).toBe(firstBody.taskIds.length + secondBody.taskIds.length)

    const firstRunStillExists = await prisma.task.findMany({ where: { runId: firstBody.runId } })
    expect(firstRunStillExists.length).toBe(firstBody.taskIds.length)
  })
})
