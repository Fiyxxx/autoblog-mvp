import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from './db'
import { restartDay } from './tasks'
import { setPostArchived } from './posts'
import { TOPICS } from './content-generator'
import { getBlogStats } from './stats'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('getBlogStats', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('returns zeroed stats when there are no posts', async () => {
    await expect(getBlogStats()).resolves.toEqual({
      totalPosts: 0,
      activeCount: 0,
      archivedCount: 0,
      totalViews: 0,
      avgBounceRate: 0,
      bestPerforming: null,
    })
  })

  it('reports counts and excludes archived posts from the best performer', async () => {
    await restartDay(new Date('2026-01-01T09:00:00Z'))
    const posts = await prisma.blogPost.findMany()
    await setPostArchived(posts[0].id, true)

    const stats = await getBlogStats()

    expect(stats.totalPosts).toBe(TOPICS.length)
    expect(stats.archivedCount).toBe(1)
    expect(stats.activeCount).toBe(TOPICS.length - 1)
    expect(stats.totalViews).toBeGreaterThan(0)
    expect(stats.avgBounceRate).toBeGreaterThan(0)
    expect(stats.bestPerforming).toHaveProperty('slug')
    expect(stats.bestPerforming).toHaveProperty('views')
    expect(stats.bestPerforming?.slug).not.toBe(posts[0].slug)
  })
})
