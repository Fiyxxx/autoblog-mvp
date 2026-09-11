import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from './db'
import { restartDay } from './tasks'
import { getPublishedPosts, getPostBySlug, setPostArchived, getFilterOptions } from './posts'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('getPublishedPosts', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('only returns posts whose task has completed', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await restartDay(start)

    const rightAfterCreation = await getPublishedPosts(start)
    expect(rightAfterCreation.length).toBe(0)

    const wayLater = await getPublishedPosts(new Date(start.getTime() + 120_000))
    expect(wayLater.length).toBeGreaterThan(0)
    expect(wayLater[0]).toHaveProperty('slug')
    expect(wayLater[0]).toHaveProperty('author')
  })

  it('excludes archived posts, and includes them again once unarchived', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await restartDay(start)
    const later = new Date(start.getTime() + 120_000)
    const before = await getPublishedPosts(later)
    const target = before[0]

    await setPostArchived((await prisma.blogPost.findFirstOrThrow({ where: { slug: target.slug } })).id, true)
    const afterArchiving = await getPublishedPosts(later)
    expect(afterArchiving.find((p) => p.slug === target.slug)).toBeUndefined()
    expect(afterArchiving.length).toBe(before.length - 1)

    const postId = (await prisma.blogPost.findFirstOrThrow({ where: { slug: target.slug } })).id
    await setPostArchived(postId, false)
    const afterUnarchiving = await getPublishedPosts(later)
    expect(afterUnarchiving.find((p) => p.slug === target.slug)).toBeDefined()
  })

  it('filters by tag', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await restartDay(start)
    const later = new Date(start.getTime() + 120_000)
    const all = await getPublishedPosts(later)
    const someTag = all[0].tags[0]
    const byTag = await getPublishedPosts(later, { tag: someTag })
    expect(byTag.length).toBeGreaterThan(0)
    expect(byTag.every((p) => p.tags.includes(someTag))).toBe(true)
  })
})

describe('getFilterOptions', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('lists distinct tags across active, published posts', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await restartDay(start)
    const later = new Date(start.getTime() + 120_000)

    const options = await getFilterOptions(later)
    expect(options.tags.length).toBeGreaterThan(0)
    expect(new Set(options.tags).size).toBe(options.tags.length)
  })
})

describe('getPostBySlug', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('returns null for an unpublished post', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await restartDay(start)
    const post = await prisma.blogPost.findFirst()
    const result = await getPostBySlug(post!.slug, start)
    expect(result).toBeNull()
  })

  it('returns the post once its task has completed', async () => {
    const start = new Date('2026-01-01T09:00:00Z')
    await restartDay(start)
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
