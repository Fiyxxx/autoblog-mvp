import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostReader } from './PostReader'

describe('PostReader', () => {
  it('renders title, byline, and markdown body as html', () => {
    render(
      <PostReader
        post={{
          title: "What's New at Aurora Labs",
          companyName: 'Aurora Labs',
          authorName: 'Priya Nathan',
          authorAvatarUrl: 'https://i.pravatar.cc/150?u=priya-nathan',
          publishedAt: new Date('2026-01-01T09:00:00Z'),
          thumbnailUrl: 'https://picsum.photos/seed/abc/800/450',
          contentMd: '# Heading\n\nSome **bold** paragraph text.',
        }}
      />
    )

    expect(screen.getByRole('heading', { name: "What's New at Aurora Labs", level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Aurora Labs')).toBeInTheDocument()
    expect(screen.getByText('Priya Nathan')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /thumbnail/i })).toBeInTheDocument()
    expect(screen.getByText('bold')).toBeInTheDocument()
  })
})
