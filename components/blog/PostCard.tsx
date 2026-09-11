import Link from 'next/link'
import type { PublishedPostSummary } from '@/lib/posts'

export function PostCard({ post }: { post: PublishedPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex flex-col gap-3 rounded-lg border p-4 transition hover:shadow-md">
      <img src={post.thumbnailUrl} alt={`${post.title} thumbnail`} className="aspect-video w-full rounded-md object-cover" />
      <span className="w-fit rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{post.tags[0]}</span>
      <h3 className="font-semibold leading-snug">{post.title}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
      <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
        <img src={post.author.avatarUrl} alt={post.author.name} className="h-5 w-5 rounded-full" />
        <span>{post.author.name}</span>
        <span aria-hidden>·</span>
        <time dateTime={post.publishedAt.toISOString()}>
          {post.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </time>
      </div>
    </Link>
  )
}
