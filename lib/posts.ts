import { prisma } from './db'

export interface PublishedPostSummary {
  slug: string
  title: string
  excerpt: string
  thumbnailUrl: string
  tags: string[]
  companyName: string
  publishedAt: Date
  author: { name: string; avatarUrl: string }
}

export async function getPublishedPosts(now: Date = new Date()): Promise<PublishedPostSummary[]> {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { lte: now } },
    include: { author: { select: { name: true, avatarUrl: true } } },
    orderBy: { publishedAt: 'desc' },
  })

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    thumbnailUrl: post.thumbnailUrl,
    tags: post.tags,
    companyName: post.companyName,
    publishedAt: post.publishedAt,
    author: post.author,
  }))
}

export interface PublishedPostDetail extends PublishedPostSummary {
  contentMd: string
}

export async function getPostBySlug(slug: string, now: Date = new Date()): Promise<PublishedPostDetail | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true, avatarUrl: true } } },
  })

  if (!post || post.publishedAt > now) return null

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    contentMd: post.contentMd,
    thumbnailUrl: post.thumbnailUrl,
    tags: post.tags,
    companyName: post.companyName,
    publishedAt: post.publishedAt,
    author: post.author,
  }
}
