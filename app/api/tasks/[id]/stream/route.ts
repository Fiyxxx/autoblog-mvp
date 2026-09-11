import { getTaskWithPost } from '@/lib/tasks'

const STREAM_INTERVAL_MS = 40

function sseEvent(event: 'chunk' | 'done', data: string): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

function waitFor(ms: number, signal: AbortSignal): Promise<boolean> {
  if (ms <= 0) return Promise.resolve(!signal.aborted)

  return new Promise((resolve) => {
    const onAbort = () => {
      clearTimeout(timer)
      resolve(false)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve(true)
    }, ms)

    signal.addEventListener('abort', onAbort, { once: true })
  })
}

export async function GET(request: Request, context: RouteContext<'/api/tasks/[id]/stream'>) {
  const { id } = await context.params
  const task = await getTaskWithPost(id)

  if (!task || !task.post) {
    return new Response('Not found', { status: 404 })
  }

  const content = task.post.contentMd
  const tokens = content.split(/(\s+)/).filter((t) => t.length > 0)
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: 'chunk' | 'done', data: string) =>
        controller.enqueue(encoder.encode(sseEvent(event, data)))
      const startedAt = task.generatingAt.getTime()
      const completedAt = task.completedAt.getTime()
      const totalMs = Math.max(completedAt - startedAt, 1)

      if (task.status === 'completed' || Date.now() >= completedAt) {
        send('chunk', content)
        send('done', '')
        controller.close()
        return
      }

      if (!(await waitFor(startedAt - Date.now(), request.signal))) {
        controller.close()
        return
      }

      let sentCount = 0

      while (sentCount < tokens.length && !request.signal.aborted) {
        const progress = Math.min(1, Math.max(0, (Date.now() - startedAt) / totalMs))
        const targetCount = progress >= 1 ? tokens.length : Math.floor(progress * tokens.length)

        if (targetCount > sentCount) {
          send('chunk', tokens.slice(sentCount, targetCount).join(''))
          sentCount = targetCount
        }

        if (sentCount === tokens.length) break

        const remainingMs = Math.max(0, completedAt - Date.now())
        if (!(await waitFor(Math.min(STREAM_INTERVAL_MS, remainingMs), request.signal))) {
          controller.close()
          return
        }
      }

      if (request.signal.aborted) {
        controller.close()
        return
      }

      if (sentCount < tokens.length) {
        send('chunk', tokens.slice(sentCount).join(''))
      }

      send('done', '')
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  })
}
