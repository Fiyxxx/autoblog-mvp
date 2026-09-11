// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from './TaskList'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

const existingTask = {
  id: 't1',
  topic: 'product-update',
  prompt: 'Write a product update.',
  author: { name: 'Priya Nathan' },
  status: 'completed' as const,
  postTitle: 'Product update',
}

describe('TaskList', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts a run from the empty state and renders its tasks', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url === '/api/tasks/restart-day' && init?.method === 'POST') {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ taskIds: ['t1'] }) })
      }
      if (url === '/api/tasks') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ tasks: [existingTask] }),
        })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<TaskList initialTasks={[]} />)

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /start day/i }))

    await waitFor(() => {
      expect(screen.getByText('product-update')).toBeInTheDocument()
    })
    expect(screen.getByText('Priya Nathan')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/tasks/restart-day', expect.objectContaining({ method: 'POST' }))
  })

  it('confirms before restarting a day that already has tasks', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    render(<TaskList initialTasks={[existingTask]} />)
    await user.click(screen.getByRole('button', { name: /restart day/i }))

    expect(confirmSpy).toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
