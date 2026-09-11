import type { Metadata } from 'next'
import { getPublishedPosts, getFilterOptions } from '@/lib/posts'
import { PostImageCard } from '@/components/blog/PostImageCard'
import { BlogMasthead } from '@/components/blog/BlogMasthead'
import { CategoryTabs } from '@/components/blog/CategoryTabs'
import { COMPANY_NAME } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description: `Product, engineering, and company updates from ${COMPANY_NAME}.`,
}

export default async function BlogHomePage({ searchParams }: PageProps<'/'>) {
  const params = await searchParams
  const tag = Array.isArray(params.tag) ? params.tag[0] : params.tag
  const now = new Date()
  const [posts, options] = await Promise.all([getPublishedPosts(now, { tag }), getFilterOptions(now)])

  return (
    <div>
      <BlogMasthead description={`New product features, the latest in engineering, and updates from ${COMPANY_NAME}.`} />
      <CategoryTabs tags={options.tags} activeTag={tag} />

      {posts.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {tag ? 'No posts match this filter.' : 'No posts yet — check back soon.'}
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-12 pt-10 sm:grid-cols-2">
          {posts.map((post) => (
            <PostImageCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
