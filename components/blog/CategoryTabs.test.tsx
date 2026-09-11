// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CategoryTabs } from './CategoryTabs'

describe('CategoryTabs', () => {
  it('links "View all" to / and each tag to its own filter query', () => {
    render(<CategoryTabs tags={['Product', 'Engineering']} />)
    expect(screen.getByRole('link', { name: 'View all' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Product' })).toHaveAttribute('href', '/?tag=Product')
    expect(screen.getByRole('link', { name: 'Engineering' })).toHaveAttribute('href', '/?tag=Engineering')
  })

  it('marks the active tag distinctly from "View all" and other tags', () => {
    render(<CategoryTabs tags={['Product', 'Engineering']} activeTag="Engineering" />)
    expect(screen.getByRole('link', { name: 'Engineering' }).className).toContain('border-foreground')
    expect(screen.getByRole('link', { name: 'View all' }).className).toContain('border-transparent')
    expect(screen.getByRole('link', { name: 'Product' }).className).toContain('border-transparent')
  })
})
