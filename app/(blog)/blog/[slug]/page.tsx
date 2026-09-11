import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import { PostReader } from '@/components/blog/PostReader'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <PostReader
      post={{
        title: post.title,
        companyName: post.companyName,
        authorName: post.author.name,
        authorAvatarUrl: post.author.avatarUrl,
        publishedAt: post.publishedAt,
        thumbnailUrl: post.thumbnailUrl,
        contentMd: post.contentMd,
      }}
    />
  )
}
