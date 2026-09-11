import Link from 'next/link'
import type { PublishedPostSummary } from '@/lib/posts'

export function FeaturedPost({ post }: { post: PublishedPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid gap-8 border-b border-border pb-10 md:grid-cols-5 md:items-start">
      <img
        src={post.thumbnailUrl}
        alt={`${post.title} thumbnail`}
        className="aspect-[4/3] w-full object-cover md:col-span-3 md:aspect-[5/4]"
      />
      <div className="md:col-span-2">
        <span className="font-mono text-xs uppercase tracking-wide text-brass">{post.tags[0]}</span>
        <h2 className="mt-3 font-serif text-3xl leading-[1.05] font-medium text-balance group-hover:text-brass">
          {post.title}
        </h2>
        <p className="mt-4 text-base text-muted-foreground">{post.excerpt}</p>
        <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-3 font-mono text-xs text-muted-foreground">
          <span className="text-ink-soft">{post.author.name}</span>
          <span aria-hidden className="text-rule">—</span>
          <time dateTime={post.publishedAt.toISOString()}>
            {post.publishedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
        </div>
      </div>
    </Link>
  )
}
