// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlogMasthead } from './BlogMasthead'

describe('BlogMasthead', () => {
  it('renders the Blog heading and the given description', () => {
    render(<BlogMasthead description="Some updates from the team." />)
    expect(screen.getByRole('heading', { name: 'Blog' })).toBeInTheDocument()
    expect(screen.getByText('Some updates from the team.')).toBeInTheDocument()
  })
})
