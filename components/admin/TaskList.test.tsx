import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { TaskList } from './TaskList'

describe('TaskList', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows an empty state, then seeds and renders tasks after 5s', async () => {
    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url === '/api/tasks/seed-day' && init?.method === 'POST') {
        return Promise.resolve({ json: () => Promise.resolve({ created: true, taskIds: ['t1'] }) })
      }
      if (url === '/api/tasks') {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              tasks: [
                { id: 't1', topic: 'product-update', prompt: 'Write a product update.', author: { name: 'Priya Nathan' }, status: 'queued', createdAt: new Date().toISOString() },
              ],
            }),
        })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<TaskList />)

    expect(screen.getByText(/waiting for today's tasks/i)).toBeInTheDocument()

    // React 19's scheduler flushes updates made outside of an event/act
    // scope via a real task, which never fires under fake timers unless the
    // advance itself is wrapped in `act` — otherwise the state update never
    // reaches the DOM and the assertions below time out.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000)
    })

    // `@testing-library`'s `waitFor` only recognizes Jest's fake timers, not
    // Vitest's — left active, it silently hangs forever instead of polling.
    // The DOM is already up to date from the `act` advance above, so
    // switching back to real timers here just lets `waitFor` do its (short,
    // immediately-satisfied) job safely.
    vi.useRealTimers()

    await waitFor(() => {
      expect(screen.getByText('product-update')).toBeInTheDocument()
    })
    expect(screen.getByText('Priya Nathan')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/tasks/seed-day', expect.objectContaining({ method: 'POST' }))
  })
})
