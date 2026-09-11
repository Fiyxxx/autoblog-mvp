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
    <article className="mx-auto max-w-2xl">
      <img src={post.thumbnailUrl} alt={`${post.title} thumbnail`} className="mb-6 aspect-video w-full rounded-lg object-cover" />
      <h1 className="mb-3 text-3xl font-bold">{post.title}</h1>
      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
        <img src={post.authorAvatarUrl} alt={post.authorName} className="h-8 w-8 rounded-full" />
        <span>{post.authorName}</span>
        <span aria-hidden>·</span>
        <span>{post.companyName}</span>
        <span aria-hidden>·</span>
        <time dateTime={post.publishedAt.toISOString()}>
          {post.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
      </div>
      <div className="prose max-w-none">
        <ReactMarkdown>{post.contentMd}</ReactMarkdown>
      </div>
    </article>
  )
}
