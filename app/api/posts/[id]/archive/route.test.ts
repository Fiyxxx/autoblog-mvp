import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from '@/lib/db'
import { restartDay } from '@/lib/tasks'
import { POST } from './route'
import { cleanupDatabase, resetContent } from '@/test/database'

describe('POST /api/posts/[id]/archive', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('toggles a post archived and back', async () => {
    await restartDay(new Date('2026-01-01T09:00:00Z'))
    const post = await prisma.blogPost.findFirstOrThrow()

    const archiveResponse = await POST(
      new Request(`http://localhost/api/posts/${post.id}/archive`, {
        method: 'POST',
        body: JSON.stringify({ archived: true }),
      }),
      { params: Promise.resolve({ id: post.id }) }
    )
    const archiveBody = await archiveResponse.json()
    expect(archiveResponse.status).toBe(200)
    expect(archiveBody.archived).toBe(true)

    const reloaded = await prisma.blogPost.findUniqueOrThrow({ where: { id: post.id } })
    expect(reloaded.archived).toBe(true)

    const unarchiveResponse = await POST(
      new Request(`http://localhost/api/posts/${post.id}/archive`, {
        method: 'POST',
        body: JSON.stringify({ archived: false }),
      }),
      { params: Promise.resolve({ id: post.id }) }
    )
    expect((await unarchiveResponse.json()).archived).toBe(false)
  })

  it('rejects a non-boolean archived value', async () => {
    await restartDay(new Date('2026-01-01T09:00:00Z'))
    const post = await prisma.blogPost.findFirstOrThrow()

    const response = await POST(
      new Request(`http://localhost/api/posts/${post.id}/archive`, {
        method: 'POST',
        body: JSON.stringify({ archived: 'yes' }),
      }),
      { params: Promise.resolve({ id: post.id }) }
    )
    expect(response.status).toBe(400)
  })

  it('returns 400 for malformed JSON and 404 for an unknown post', async () => {
    const malformed = await POST(
      new Request('http://localhost/api/posts/missing/archive', { method: 'POST', body: '{' }),
      { params: Promise.resolve({ id: 'missing' }) }
    )
    expect(malformed.status).toBe(400)

    const missing = await POST(
      new Request('http://localhost/api/posts/missing/archive', {
        method: 'POST',
        body: JSON.stringify({ archived: true }),
      }),
      { params: Promise.resolve({ id: 'missing' }) }
    )
    expect(missing.status).toBe(404)
  })
})
