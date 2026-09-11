import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from './db'
import { createDailyTasks, listTasksWithStatus, getTaskWithPost } from './tasks'
import { TOPICS } from './content-generator'

async function resetDb() {
  await prisma.blogPost.deleteMany()
  await prisma.task.deleteMany()
}

describe('createDailyTasks', () => {
  beforeEach(resetDb)
  afterAll(async () => {
    await resetDb()
    await prisma.$disconnect()
  })

  it('creates one task per topic, each with a generated post', async () => {
    const result = await createDailyTasks(new Date('2026-01-01T09:00:00Z'))
    expect(result.created).toBe(true)
    expect(result.taskIds.length).toBe(TOPICS.length)

    const tasks = await prisma.task.findMany({ include: { post: true } })
    expect(tasks.length).toBe(TOPICS.length)
    for (const task of tasks) {
      expect(task.post).not.toBeNull()
      expect(task.queuedAt.getTime()).toBeLessThan(task.generatingAt.getTime())
      expect(task.generatingAt.getTime()).toBeLessThan(task.completedAt.getTime())
    }
  })

  it('is idempotent for the same day', async () => {
    const first = await createDailyTasks(new Date('2026-01-01T09:00:00Z'))
    const second = await createDailyTasks(new Date('2026-01-01T18:00:00Z'))
    expect(first.created).toBe(true)
    expect(second.created).toBe(false)

    const tasks = await prisma.task.findMany()
    expect(tasks.length).toBe(TOPICS.length)
  })
})

describe('listTasksWithStatus', () => {
  beforeEach(resetDb)
  afterAll(async () => {
    await resetDb()
    await prisma.$disconnect()
  })

  it('reports derived status for each task', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await createDailyTasks(start)

    const soon = new Date(start.getTime() + 1000)
    const list = await listTasksWithStatus(soon)
    expect(list.length).toBe(TOPICS.length)
    expect(list.every((t) => t.status === 'queued')).toBe(true)

    const muchLater = new Date(start.getTime() + 60_000)
    const listLater = await listTasksWithStatus(muchLater)
    expect(listLater.every((t) => t.status === 'completed')).toBe(true)
  })
})

describe('getTaskWithPost', () => {
  beforeEach(resetDb)
  afterAll(async () => {
    await resetDb()
    await prisma.$disconnect()
  })

  it('returns null for an unknown id', async () => {
    const result = await getTaskWithPost('00000000-0000-0000-0000-000000000000')
    expect(result).toBeNull()
  })

  it('returns the task with its generated post', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    const { taskIds } = await createDailyTasks(start)
    const task = await getTaskWithPost(taskIds[0], start)
    expect(task).not.toBeNull()
    expect(task!.post).not.toBeNull()
    expect(task!.status).toBe('queued')
  })
})
