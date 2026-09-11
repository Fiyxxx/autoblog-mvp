import { getPublishedPosts } from '@/lib/posts'
import { FeaturedPost } from '@/components/blog/FeaturedPost'
import { PostCard } from '@/components/blog/PostCard'

export const dynamic = 'force-dynamic'

export default async function BlogHomePage() {
  const posts = await getPublishedPosts()

  if (posts.length === 0) {
    return <p className="text-muted-foreground">No posts published yet — check back soon.</p>
  }

  const [featured, ...rest] = posts

  return (
    <div className="flex flex-col gap-12">
      <FeaturedPost post={featured} />
      {rest.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
