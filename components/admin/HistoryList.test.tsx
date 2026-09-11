// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HistoryList } from './HistoryList'

const run = {
  id: 'run-1',
  startedAt: '2026-01-01T09:00:00.000Z',
  taskCount: 20,
  activePostCount: 20,
  archivedPostCount: 0,
}

describe('HistoryList', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows an empty state with no runs', () => {
    render(<HistoryList initialRuns={[]} />)
    expect(screen.getByText('No runs yet.')).toBeInTheDocument()
  })

  it('expands a run to show its posts and archives a post', async () => {
    const user = userEvent.setup()
    let archived = false

    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url === '/api/runs/run-1/posts') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              posts: [
                {
                  taskId: 't1',
                  postId: 'p1',
                  title: 'A Test Post',
                  archived,
                  author: { name: 'Priya Nathan' },
                  tags: ['Product'],
                  views: 1234,
                  bounceRate: 32.5,
                },
              ],
            }),
        })
      }
      if (url === '/api/posts/p1/archive' && init?.method === 'POST') {
        archived = JSON.parse(init.body as string).archived
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: 'p1', archived }) })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<HistoryList initialRuns={[run]} />)
    await user.click(screen.getByText(/January 1, 2026/))

    await waitFor(() => {
      expect(screen.getByText('A Test Post')).toBeInTheDocument()
    })
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('1,234 views · 32.5% bounce')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Archive' }))

    await waitFor(() => {
      expect(screen.getByText('Archived')).toBeInTheDocument()
    })
    expect(fetchMock).toHaveBeenCalledWith('/api/posts/p1/archive', expect.objectContaining({ method: 'POST' }))
  })
})
