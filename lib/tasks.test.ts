import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from './db'
import { restartDay, listTasksWithStatus, getTaskWithPost, listRuns, listPostsForRun } from './tasks'
import { TOPICS } from './content-generator'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('restartDay', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('creates one task per topic under a new run, each with a generated post', async () => {
    const result = await restartDay(new Date('2026-01-01T09:00:00Z'))
    expect(result.taskIds.length).toBe(TOPICS.length)

    const tasks = await prisma.task.findMany({ where: { runId: result.runId }, include: { post: true } })
    expect(tasks.length).toBe(TOPICS.length)
    for (const task of tasks) {
      expect(task.post).not.toBeNull()
      expect(task.queuedAt.getTime()).toBeLessThan(task.generatingAt.getTime())
      expect(task.generatingAt.getTime()).toBeLessThan(task.completedAt.getTime())
    }
  })

  it('never deletes prior runs — calling it again accumulates a second run alongside the first', async () => {
    const first = await restartDay(new Date('2026-01-01T09:00:00Z'))
    const second = await restartDay(new Date('2026-01-01T18:00:00Z'))
    expect(second.runId).not.toBe(first.runId)
    expect(second.taskIds).not.toEqual(first.taskIds)

    const tasks = await prisma.task.findMany()
    expect(tasks.length).toBe(TOPICS.length * 2)

    const firstRunTasks = await prisma.task.findMany({ where: { runId: first.runId } })
    expect(firstRunTasks.length).toBe(TOPICS.length)
  })
})

describe('listTasksWithStatus', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('reports derived status for each task in the latest run', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await restartDay(start)

    const soon = new Date(start.getTime() + 1000)
    const list = await listTasksWithStatus(soon)
    expect(list.length).toBe(TOPICS.length)
    expect(list.every((t) => t.status === 'queued')).toBe(true)

    const muchLater = new Date(start.getTime() + 60_000)
    const listLater = await listTasksWithStatus(muchLater)
    expect(listLater.every((t) => t.status === 'completed')).toBe(true)
  })

  it('defaults to only the most recently started run', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    const first = await restartDay(start)
    const second = await restartDay(new Date(start.getTime() + 3600_000))

    const list = await listTasksWithStatus(new Date(start.getTime() + 3600_000 + 1000))
    expect(list.length).toBe(TOPICS.length)
    expect(list.map((t) => t.id).sort()).toEqual([...second.taskIds].sort())
    expect(list.map((t) => t.id)).not.toEqual(first.taskIds)
  })
})

describe('listRuns and listPostsForRun', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('lists runs newest-first with task and post counts', async () => {
    const first = await restartDay(new Date('2026-01-01T09:00:00Z'))
    const second = await restartDay(new Date('2026-01-02T09:00:00Z'))

    const runs = await listRuns()
    expect(runs.length).toBe(2)
    expect(runs[0].id).toBe(second.runId)
    expect(runs[1].id).toBe(first.runId)
    expect(runs[0].taskCount).toBe(TOPICS.length)
    expect(runs[0].activePostCount).toBe(TOPICS.length)
    expect(runs[0].archivedPostCount).toBe(0)
  })

  it('lists the posts belonging to one run', async () => {
    const run = await restartDay(new Date('2026-01-01T09:00:00Z'))
    const posts = await listPostsForRun(run.runId)
    expect(posts).not.toBeNull()
    if (!posts) return
    expect(posts.length).toBe(TOPICS.length)
    expect(posts.map((p) => p.taskId).sort()).toEqual([...run.taskIds].sort())
    expect(posts.every((p) => p.archived === false)).toBe(true)
  })
})

describe('getTaskWithPost', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('returns null for an unknown id', async () => {
    const result = await getTaskWithPost('00000000-0000-0000-0000-000000000000')
    expect(result).toBeNull()
  })

  it('returns the task with its generated post', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    const { taskIds } = await restartDay(start)
    const task = await getTaskWithPost(taskIds[0], start)
    expect(task).not.toBeNull()
    expect(task!.post).not.toBeNull()
    expect(task!.status).toBe('queued')
  })
})
