// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsDashboard } from './StatsDashboard'

describe('StatsDashboard', () => {
  it('renders nothing when there are no posts', () => {
    const { container } = render(
      <StatsDashboard
        stats={{
          totalPosts: 0,
          activeCount: 0,
          archivedCount: 0,
          totalViews: 0,
          avgBounceRate: 0,
          bestPerforming: null,
        }}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders stat cells, radial rates, and the best-performing link', () => {
    render(
      <StatsDashboard
        stats={{
          totalPosts: 20,
          activeCount: 18,
          archivedCount: 2,
          totalViews: 12345,
          avgBounceRate: 40,
          bestPerforming: { title: 'Best Post', slug: 'best-post', views: 4200 },
        }}
      />
    )

    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('12,345')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Best Post' })).toHaveAttribute('href', '/blog/best-post')
  })
})
