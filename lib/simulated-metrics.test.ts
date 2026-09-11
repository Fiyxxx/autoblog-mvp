import { describe, it, expect } from 'vitest'
import { simulatedViews, simulatedBounceRate } from './simulated-metrics'

describe('simulatedViews', () => {
  it('is deterministic for the same id', () => {
    expect(simulatedViews('post-1')).toBe(simulatedViews('post-1'))
  })

  it('differs across ids and stays in a sane range', () => {
    const a = simulatedViews('post-1')
    const b = simulatedViews('post-2')
    expect(a).not.toBe(b)
    expect(a).toBeGreaterThanOrEqual(150)
    expect(a).toBeLessThanOrEqual(4650)
  })
})

describe('simulatedBounceRate', () => {
  it('is deterministic and stays within a plausible percentage range', () => {
    const rate = simulatedBounceRate('post-1')
    expect(simulatedBounceRate('post-1')).toBe(rate)
    expect(rate).toBeGreaterThanOrEqual(20)
    expect(rate).toBeLessThanOrEqual(65)
  })
})
