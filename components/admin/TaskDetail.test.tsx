// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { TaskDetail, type TaskDetailData } from './TaskDetail'

class FakeEventSource {
  static instances: FakeEventSource[] = []
  private listeners: Record<string, ((event: { data: string }) => void)[]> = {}
  closed = false

  constructor(public url: string) {
    FakeEventSource.instances.push(this)
  }

  addEventListener(type: string, callback: (event: { data: string }) => void) {
    this.listeners[type] = [...(this.listeners[type] ?? []), callback]
  }

  emit(type: string, data: string) {
    for (const callback of this.listeners[type] ?? []) callback({ data: JSON.stringify(data) })
  }

  close() {
    this.closed = true
  }
}

function baseTask(overrides: Partial<TaskDetailData> = {}): TaskDetailData {
  return {
    id: 't1',
    prompt: 'Write a product update blog post for Aurora Labs.',
    topic: 'product-update',
    status: 'completed',
    queuedAt: '2026-01-01T09:00:00.000Z',
    generatingAt: '2026-01-01T09:00:05.000Z',
    completedAt: '2026-01-01T09:00:15.000Z',
    author: { name: 'Priya Nathan', avatarUrl: 'https://i.pravatar.cc/150?u=priya-nathan' },
    post: {
      title: "What's New at Aurora Labs",
      slug: 'whats-new-at-aurora-labs-t1',
      excerpt: 'A roundup.',
      contentMd: 'Body text here.',
      thumbnailUrl: 'https://picsum.photos/seed/t1/800/450',
      tags: ['Product'],
      companyName: 'Aurora Labs',
      archived: false,
    },
    ...overrides,
  }
}

describe('TaskDetail', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    FakeEventSource.instances = []
  })

  it('shows the prompt, status, and post preview once loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: () => Promise.resolve(baseTask()) })
    )

    render(<TaskDetail initialTask={baseTask()} />)

    await waitFor(() => {
      expect(screen.getByText('Write a product update blog post for Aurora Labs.')).toBeInTheDocument()
    })
    expect(screen.getByText('FILED')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "What's New at Aurora Labs" })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view published post/i })).toHaveAttribute('href', '/blog/whats-new-at-aurora-labs-t1')
  })

  it('shows a skeleton placeholder while queued, with no post content rendered', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: () => Promise.resolve(baseTask({ status: 'queued' })) })
    )

    render(<TaskDetail initialTask={baseTask({ status: 'queued' })} />)

    await waitFor(() => {
      expect(screen.getByText('QUEUED')).toBeInTheDocument()
    })
    expect(screen.queryByText('Body text here.')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: "What's New at Aurora Labs" })).not.toBeInTheDocument()
  })

  it('labels archived copy and does not link to the unavailable public post', () => {
    const task = baseTask()
    if (!task.post) throw new Error('Expected test post')
    task.post.archived = true

    render(<TaskDetail initialTask={task} />)

    expect(screen.getByText('Filed copy · Archived')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view published post/i })).not.toBeInTheDocument()
  })

  it('streams chunks from the SSE endpoint into the draft while generating', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: () => Promise.resolve(baseTask({ status: 'generating' })) })
    )

    render(<TaskDetail initialTask={baseTask({ status: 'generating' })} />)

    await waitFor(() => {
      expect(FakeEventSource.instances.length).toBe(1)
    })
    expect(FakeEventSource.instances[0].url).toBe('/api/tasks/t1/stream')

    FakeEventSource.instances[0].emit('chunk', 'Hello ')
    FakeEventSource.instances[0].emit('chunk', 'world.')

    await waitFor(() => {
      expect(screen.getByText('Hello world.')).toBeInTheDocument()
    })

    FakeEventSource.instances[0].emit('done', '')
    await waitFor(() => {
      expect(FakeEventSource.instances[0].closed).toBe(true)
    })
  })
})
