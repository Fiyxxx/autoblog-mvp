import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { prisma } from '@/lib/db'
import { restartDay } from '@/lib/tasks'
import { GET } from './route'
import { cleanupDatabase, resetContent } from '@/test/database'

async function readAllEvents(response: Response): Promise<{ event: string; data: string }[]> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  const events: { event: string; data: string }[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundary: number
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      const raw = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      const eventLine = raw.split('\n').find((l) => l.startsWith('event: '))
      const dataLine = raw.split('\n').find((l) => l.startsWith('data: '))
      if (eventLine && dataLine) {
        events.push({ event: eventLine.slice(7), data: JSON.parse(dataLine.slice(6)) })
      }
    }
  }

  return events
}

describe('GET /api/tasks/[id]/stream', () => {
  beforeEach(resetContent)
  afterAll(cleanupDatabase)

  it('returns 404 for an unknown task', async () => {
    const response = await GET(new Request('http://localhost/api/tasks/x/stream'), {
      params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000000' }),
    })
    expect(response.status).toBe(404)
  })

  it('streams the already-completed post content in one chunk', async () => {
    const past = new Date(Date.now() - 60_000)
    const { taskIds } = await restartDay(past)

    const response = await GET(new Request('http://localhost/api/tasks/x/stream'), {
      params: Promise.resolve({ id: taskIds[0] }),
    })
    expect(response.headers.get('Content-Type')).toBe('text/event-stream; charset=utf-8')

    const events = await readAllEvents(response)
    expect(events[events.length - 1].event).toBe('done')
    const fullText = events
      .filter((e) => e.event === 'chunk')
      .map((e) => e.data)
      .join('')
    expect(fullText.length).toBeGreaterThan(0)
  })

  it(
    'streams a not-yet-completed task token by token, ending in a done event',
    async () => {
      const now = new Date()
      const { taskIds } = await restartDay(now)
      const task = await prisma.task.findUniqueOrThrow({ where: { id: taskIds[0] } })

      await prisma.task.update({
        where: { id: task.id },
        data: {
          queuedAt: new Date(now.getTime() - 5000),
          generatingAt: new Date(now.getTime() - 100),
          completedAt: new Date(now.getTime() + 50),
        },
      })

      const response = await GET(new Request('http://localhost/api/tasks/x/stream'), {
        params: Promise.resolve({ id: task.id }),
      })
      const events = await readAllEvents(response)

      expect(events.length).toBeGreaterThan(1)
      expect(events[events.length - 1].event).toBe('done')
      const post = await prisma.blogPost.findUniqueOrThrow({ where: { taskId: task.id } })
      const fullText = events
        .filter((e) => e.event === 'chunk')
        .map((e) => e.data)
        .join('')
      expect(fullText).toBe(post.contentMd)
    },
    15_000
  )
})
