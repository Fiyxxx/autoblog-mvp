import Link from 'next/link'
import type { PublishedPostSummary } from '@/lib/posts'

export function PostCard({ post }: { post: PublishedPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col gap-3">
      <img
        src={post.thumbnailUrl}
        alt={`${post.title} thumbnail`}
        className="aspect-[4/3] w-full object-cover grayscale transition-[filter] group-hover:grayscale-0"
      />
      <span className="font-mono text-[0.7rem] uppercase tracking-wide text-brass">{post.tags[0]}</span>
      <h3 className="font-serif text-xl leading-snug font-medium text-balance">{post.title}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
      <div className="mt-auto flex items-baseline gap-2 pt-2 font-mono text-xs text-muted-foreground">
        <span className="text-ink-soft">{post.author.name}</span>
        <span aria-hidden className="text-rule">—</span>
        <time dateTime={post.publishedAt.toISOString()}>
          {post.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </time>
      </div>
    </Link>
  )
}
