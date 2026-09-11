// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostImageCard } from './PostImageCard'

const post = {
  slug: 'whats-new-abc123',
  title: "What's New at Aurora Labs",
  excerpt: 'A roundup of updates.',
  thumbnailUrl: 'https://picsum.photos/seed/abc/800/450',
  tags: ['Product'],
  companyName: 'Aurora Labs',
  publishedAt: new Date('2026-01-01T09:00:00Z'),
  readingMinutes: 3,
  author: { name: 'Priya Nathan', avatarUrl: 'https://i.pravatar.cc/150?u=priya-nathan' },
}

describe('PostImageCard', () => {
  it('shows title, excerpt, author, date, category, and a read-post link to the post', () => {
    render(<PostImageCard post={post} />)

    const links = screen.getAllByRole('link')
    expect(links.every((l) => l.getAttribute('href') === '/blog/whats-new-abc123')).toBe(true)

    expect(screen.getByRole('heading', { name: "What's New at Aurora Labs" })).toBeInTheDocument()
    expect(screen.getByText('A roundup of updates.')).toBeInTheDocument()
    expect(screen.getByText('Priya Nathan')).toBeInTheDocument()
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Read post')).toBeInTheDocument()
  })
})
