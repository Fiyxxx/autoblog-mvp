import Image from 'next/image'
import Link from 'next/link'
import type { PublishedPostSummary } from '@/lib/posts'

export function PostImageCard({ post }: { post: PublishedPostSummary }) {
  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={post.thumbnailUrl}
            alt={`${post.title} thumbnail`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="absolute top-0 right-0 border-t-[36px] border-l-[36px] border-t-foreground border-l-transparent"
          />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute bottom-4 left-4 text-sm">
            <span className="block font-semibold text-white">{post.author.name}</span>
            <time
              dateTime={post.publishedAt.toISOString()}
              className="block text-white/80"
            >
              {post.publishedAt.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </time>
          </span>
          <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground">
            {post.tags[0] ?? 'Article'}
          </span>
        </div>

        <h2 className="mt-5 text-lg font-bold tracking-tight group-hover:underline">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold group-hover:underline">
          Read post
          <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
            <path
              d="M4 12L12 4M12 4H5M12 4V11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </article>
  )
}
