import { describe, it, expect, afterAll } from 'vitest'
import { prisma } from './db'

describe('db seed', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('has 4 seeded authors', async () => {
    const authors = await prisma.author.findMany()
    expect(authors.length).toBe(4)
    expect(authors.map((a) => a.name)).toContain('Priya Nathan')
  })
})
