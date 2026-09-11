import Link from 'next/link'
import type { PublishedPostSummary } from '@/lib/posts'

export function FeaturedPost({ post }: { post: PublishedPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="grid gap-6 md:grid-cols-2 md:items-center">
      <img src={post.thumbnailUrl} alt={`${post.title} thumbnail`} className="aspect-video w-full rounded-lg object-cover" />
      <div>
        <span className="mb-3 inline-block w-fit rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{post.tags[0]}</span>
        <h2 className="mb-2 text-2xl font-bold leading-tight">{post.title}</h2>
        <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img src={post.author.avatarUrl} alt={post.author.name} className="h-6 w-6 rounded-full" />
          <span>{post.author.name}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt.toISOString()}>
            {post.publishedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
        </div>
      </div>
    </Link>
  )
}
