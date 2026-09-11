import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { estimateReadingMinutes } from '@/lib/reading-time'

export interface PostReaderData {
  title: string
  companyName: string
  authorName: string
  authorAvatarUrl: string
  publishedAt: Date
  thumbnailUrl: string
  contentMd: string
}

export function PostReader({ post }: { post: PostReaderData }) {
  return (
    <article className="mx-auto max-w-2xl">
      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={post.thumbnailUrl}
          alt={`${post.title} thumbnail`}
          fill
          preload
          sizes="(min-width: 672px) 672px, 100vw"
          className="object-cover"
        />
      </div>
      <h1 className="mb-5 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
        {post.title}
      </h1>
      <div className="mb-10 flex flex-wrap items-center gap-3 border-y border-border py-4 text-sm text-muted-foreground">
        <Image src={post.authorAvatarUrl} alt="" width={32} height={32} className="size-8 rounded-full" />
        <span className="font-medium text-foreground">{post.authorName}</span>
        <span className="flex basis-full flex-wrap items-center gap-2 sm:ml-auto sm:basis-auto">
          <span>{post.companyName}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt.toISOString()}>
            {post.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <span aria-hidden>·</span>
          <span>{estimateReadingMinutes(post.contentMd)} min read</span>
        </span>
      </div>
      <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-[1.0625rem] prose-p:leading-[1.7] prose-a:text-brass">
        <ReactMarkdown>{post.contentMd}</ReactMarkdown>
      </div>
    </article>
  )
}
