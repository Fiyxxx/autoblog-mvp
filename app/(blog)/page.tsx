import { getPublishedPosts } from '@/lib/posts'
import { FeaturedPost } from '@/components/blog/FeaturedPost'
import { PostCard } from '@/components/blog/PostCard'

export const dynamic = 'force-dynamic'

export default async function BlogHomePage() {
  const posts = await getPublishedPosts()

  if (posts.length === 0) {
    return (
      <p className="border-t border-border pt-10 text-center font-mono text-xs text-muted-foreground">
        the wire is quiet — nothing filed yet
      </p>
    )
  }

  const [featured, ...rest] = posts

  return (
    <div className="flex flex-col gap-10">
      <FeaturedPost post={featured} />
      {rest.length > 0 && (
        <div className="grid divide-y divide-border md:grid-cols-3 md:gap-8 md:divide-y-0 md:divide-x">
          {rest.map((post) => (
            <div key={post.slug} className="py-6 first:pt-0 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
