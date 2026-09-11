// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskStatusBadge } from './TaskStatusBadge'

describe('TaskStatusBadge', () => {
  it('renders a human label for each status', () => {
    render(<TaskStatusBadge status="queued" />)
    expect(screen.getByText('QUEUED')).toBeInTheDocument()

    render(<TaskStatusBadge status="generating" />)
    expect(screen.getByText('GENERATING')).toBeInTheDocument()

    render(<TaskStatusBadge status="completed" />)
    expect(screen.getByText('FILED')).toBeInTheDocument()
  })
})
