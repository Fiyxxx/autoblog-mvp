import { getPublishedPosts } from '@/lib/posts'
import { COMPANY_NAME, SITE_URL } from '@/lib/constants'

export async function GET() {
  const posts = await getPublishedPosts()

  const lines = [
    `# ${COMPANY_NAME}`,
    '',
    `> Product, engineering, and company updates from ${COMPANY_NAME}.`,
    '',
    '## Blog',
    '',
    ...posts.map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.excerpt}`),
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
