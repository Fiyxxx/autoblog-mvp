import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedPost } from './FeaturedPost'

const post = {
  slug: 'whats-new-abc123',
  title: "What's New at Aurora Labs",
  excerpt: 'A roundup of updates.',
  thumbnailUrl: 'https://picsum.photos/seed/abc/800/450',
  tags: ['Product'],
  companyName: 'Aurora Labs',
  publishedAt: new Date('2026-01-01T09:00:00Z'),
  author: { name: 'Priya Nathan', avatarUrl: 'https://i.pravatar.cc/150?u=priya-nathan' },
}

describe('FeaturedPost', () => {
  it('renders a large featured card linking to the post', () => {
    render(<FeaturedPost post={post} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/whats-new-abc123')
    expect(screen.getByRole('heading', { name: "What's New at Aurora Labs" })).toBeInTheDocument()
    expect(screen.getByText('A roundup of updates.')).toBeInTheDocument()
  })
})
