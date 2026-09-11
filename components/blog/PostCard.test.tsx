import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostCard } from './PostCard'

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

describe('PostCard', () => {
  it('links to the post and shows title, tag, author', () => {
    render(<PostCard post={post} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/whats-new-abc123')
    expect(screen.getByText("What's New at Aurora Labs")).toBeInTheDocument()
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Priya Nathan')).toBeInTheDocument()
  })
})
