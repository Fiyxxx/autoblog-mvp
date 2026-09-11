import { prisma } from './db'
import { simulatedViews, simulatedBounceRate } from './simulated-metrics'

export interface BlogStats {
  totalPosts: number
  activeCount: number
  archivedCount: number
  totalViews: number
  avgBounceRate: number
  bestPerforming: { title: string; slug: string; views: number } | null
}

export async function getBlogStats(now: Date = new Date()): Promise<BlogStats> {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, title: true, slug: true, archived: true, publishedAt: true },
  })

  if (posts.length === 0) {
    return { totalPosts: 0, activeCount: 0, archivedCount: 0, totalViews: 0, avgBounceRate: 0, bestPerforming: null }
  }

  const withMetrics = posts.map((post) => ({
    ...post,
    views: simulatedViews(post.id),
    bounceRate: simulatedBounceRate(post.id),
  }))

  const totalViews = withMetrics.reduce((sum, post) => sum + post.views, 0)
  const avgBounceRate =
    Math.round((withMetrics.reduce((sum, post) => sum + post.bounceRate, 0) / withMetrics.length) * 10) / 10
  const activePosts = withMetrics.filter((post) => !post.archived && post.publishedAt <= now)
  const best = activePosts.length
    ? activePosts.reduce((max, post) => (post.views > max.views ? post : max))
    : null

  return {
    totalPosts: posts.length,
    activeCount: posts.filter((p) => !p.archived).length,
    archivedCount: posts.filter((p) => p.archived).length,
    totalViews,
    avgBounceRate,
    bestPerforming: best ? { title: best.title, slug: best.slug, views: best.views } : null,
  }
}
