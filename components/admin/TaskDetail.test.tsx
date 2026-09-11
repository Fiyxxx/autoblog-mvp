import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { TaskDetail } from './TaskDetail'

describe('TaskDetail', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the prompt, status, and post preview once loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
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
            },
          }),
      })
    )

    render(<TaskDetail taskId="t1" />)

    await waitFor(() => {
      expect(screen.getByText('Write a product update blog post for Aurora Labs.')).toBeInTheDocument()
    })
    expect(screen.getByText('FILED')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "What's New at Aurora Labs" })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view on the wire/i })).toHaveAttribute('href', '/blog/whats-new-at-aurora-labs-t1')
  })
})
