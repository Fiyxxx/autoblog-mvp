import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug } from '@/lib/posts'
import { PostReader } from '@/components/blog/PostReader'
import { SITE_URL } from '@/lib/constants'

const getPost = cache(getPostBySlug)

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
      images: [{ url: post.thumbnailUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnailUrl],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.thumbnailUrl],
    datePublished: post.publishedAt.toISOString(),
    author: [{ '@type': 'Person', name: post.author.name }],
    publisher: { '@type': 'Organization', name: post.companyName },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
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
    </>
  )
}
