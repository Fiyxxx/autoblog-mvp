import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify("What’s New at Aurora Labs!")).toBe('whats-new-at-aurora-labs')
  })

  it('strips repeated separators', () => {
    expect(slugify('  Multiple   Spaces -- here ')).toBe('multiple-spaces-here')
  })
})
