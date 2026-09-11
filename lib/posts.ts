import { prisma } from './db'
import { estimateReadingMinutes } from './reading-time'

export interface PublishedPostSummary {
  slug: string
  title: string
  excerpt: string
  thumbnailUrl: string
  tags: string[]
  publishedAt: Date
  readingMinutes: number
  author: { name: string; avatarUrl: string }
}

export interface PublishedPostsFilter {
  tag?: string
}

export async function getPublishedPosts(
  now: Date = new Date(),
  filter: PublishedPostsFilter = {}
): Promise<PublishedPostSummary[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      publishedAt: { lte: now },
      archived: false,
      ...(filter.tag ? { tags: { has: filter.tag } } : {}),
    },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      contentMd: true,
      thumbnailUrl: true,
      tags: true,
      publishedAt: true,
      author: { select: { name: true, avatarUrl: true } },
    },
    orderBy: { publishedAt: 'desc' },
  })

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    thumbnailUrl: post.thumbnailUrl,
    tags: post.tags,
    publishedAt: post.publishedAt,
    readingMinutes: estimateReadingMinutes(post.contentMd),
    author: post.author,
  }))
}

export interface PublishedPostDetail extends PublishedPostSummary {
  companyName: string
  contentMd: string
}

export async function getPostBySlug(slug: string, now: Date = new Date()): Promise<PublishedPostDetail | null> {
  const post = await prisma.blogPost.findFirst({
    where: { slug, publishedAt: { lte: now }, archived: false },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      contentMd: true,
      thumbnailUrl: true,
      tags: true,
      companyName: true,
      publishedAt: true,
      author: { select: { name: true, avatarUrl: true } },
    },
  })

  if (!post) return null

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    contentMd: post.contentMd,
    thumbnailUrl: post.thumbnailUrl,
    tags: post.tags,
    companyName: post.companyName,
    publishedAt: post.publishedAt,
    readingMinutes: estimateReadingMinutes(post.contentMd),
    author: post.author,
  }
}

export interface BlogFilterOptions {
  tags: string[]
}

export async function getFilterOptions(now: Date = new Date()): Promise<BlogFilterOptions> {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { lte: now }, archived: false },
    select: { tags: true },
  })

  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()

  return { tags }
}

export async function setPostArchived(
  postId: string,
  archived: boolean
): Promise<{ id: string; archived: boolean } | null> {
  const result = await prisma.blogPost.updateMany({ where: { id: postId }, data: { archived } })
  return result.count === 0 ? null : { id: postId, archived }
}
