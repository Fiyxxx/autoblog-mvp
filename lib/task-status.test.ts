import { describe, it, expect } from 'vitest'
import { deriveStatus } from './task-status'

describe('deriveStatus', () => {
  const base = {
    queuedAt: new Date('2026-01-01T00:00:00Z'),
    generatingAt: new Date('2026-01-01T00:00:05Z'),
    completedAt: new Date('2026-01-01T00:00:15Z'),
  }

  it('returns queued before generatingAt', () => {
    expect(deriveStatus(base, new Date('2026-01-01T00:00:02Z'))).toBe('queued')
  })

  it('returns generating between generatingAt and completedAt', () => {
    expect(deriveStatus(base, new Date('2026-01-01T00:00:10Z'))).toBe('generating')
  })

  it('returns completed at or after completedAt', () => {
    expect(deriveStatus(base, new Date('2026-01-01T00:00:15Z'))).toBe('completed')
    expect(deriveStatus(base, new Date('2026-01-01T00:01:00Z'))).toBe('completed')
  })
})
