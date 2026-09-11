import ReactMarkdown from 'react-markdown'

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
    <article className="mx-auto max-w-xl">
      <img
        src={post.thumbnailUrl}
        alt={`${post.title} thumbnail`}
        className="mb-8 aspect-[16/9] w-full object-cover"
      />
      <h1 className="mb-4 font-serif text-4xl leading-[1.05] font-medium text-balance">{post.title}</h1>
      <div className="mb-10 flex items-center gap-3 border-y border-border py-3 font-mono text-xs text-muted-foreground">
        <img src={post.authorAvatarUrl} alt={post.authorName} className="size-7 rounded-full grayscale" />
        <span className="text-ink-soft">
          By <span>{post.authorName}</span>
        </span>
        <span className="ml-auto flex items-baseline gap-2">
          <span>{post.companyName}</span>
          <span aria-hidden className="text-rule">—</span>
          <time dateTime={post.publishedAt.toISOString()}>
            {post.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </span>
      </div>
      <div className="prose prose-neutral max-w-none font-serif prose-headings:font-serif prose-headings:font-medium prose-p:text-[1.0625rem] prose-p:leading-[1.7] prose-a:text-brass">
        <ReactMarkdown>{post.contentMd}</ReactMarkdown>
      </div>
    </article>
  )
}
