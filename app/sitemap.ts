import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/posts'
import { SITE_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts()

  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
