import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from '@/lib/db'
import { restartDay } from '@/lib/tasks'
import { GET } from './route'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('GET /llms.txt', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('lists every published post as a markdown link', async () => {
    const past = new Date(Date.now() - 60_000)
    await restartDay(past)

    const response = await GET()
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')

    const body = await response.text()
    expect(body).toContain('# Aurora Labs')
    expect(body).toContain('## Blog')

    const posts = await prisma.blogPost.findMany()
    for (const post of posts) {
      expect(body).toContain(`(http://localhost:3000/blog/${post.slug})`)
      expect(body).toContain(post.title)
    }
  })

  it('still renders the header with no published posts', async () => {
    const response = await GET()
    const body = await response.text()
    expect(body).toContain('# Aurora Labs')
    expect(body).toContain('## Blog')
  })
})
