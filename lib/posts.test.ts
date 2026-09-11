import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from './db'
import { createDailyTasks } from './tasks'
import { getPublishedPosts, getPostBySlug } from './posts'

async function resetDb() {
  await prisma.blogPost.deleteMany()
  await prisma.task.deleteMany()
}

describe('getPublishedPosts', () => {
  beforeEach(resetDb)
  afterAll(async () => {
    await resetDb()
    await prisma.$disconnect()
  })

  it('only returns posts whose task has completed', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await createDailyTasks(start)

    const rightAfterCreation = await getPublishedPosts(start)
    expect(rightAfterCreation.length).toBe(0)

    const wayLater = await getPublishedPosts(new Date(start.getTime() + 120_000))
    expect(wayLater.length).toBeGreaterThan(0)
    expect(wayLater[0]).toHaveProperty('slug')
    expect(wayLater[0]).toHaveProperty('author')
  })
})

describe('getPostBySlug', () => {
  beforeEach(resetDb)
  afterAll(async () => {
    await resetDb()
    await prisma.$disconnect()
  })

  it('returns null for an unpublished post', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await createDailyTasks(start)
    const post = await prisma.blogPost.findFirst()
    const result = await getPostBySlug(post!.slug, start)
    expect(result).toBeNull()
  })

  it('returns the post once its task has completed', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await createDailyTasks(start)
    const post = await prisma.blogPost.findFirst()
    const result = await getPostBySlug(post!.slug, new Date(start.getTime() + 120_000))
    expect(result).not.toBeNull()
    expect(result!.slug).toBe(post!.slug)
  })

  it('returns null for an unknown slug', async () => {
    const result = await getPostBySlug('does-not-exist')
    expect(result).toBeNull()
  })
})
