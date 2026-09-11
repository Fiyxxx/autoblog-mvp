import { describe, it, expect } from 'vitest'
import { generateBlogPost, TOPICS } from './content-generator'

describe('generateBlogPost', () => {
  it('produces a title containing the company name for every topic', () => {
    for (const topic of TOPICS) {
      const post = generateBlogPost({ topicKey: topic.key, taskId: 'task-123', companyName: 'Aurora Labs' })
      expect(post.title).toContain('Aurora Labs')
      expect(post.contentMd.length).toBeGreaterThan(200)
      expect(post.excerpt.length).toBeGreaterThan(0)
      expect(post.tags.length).toBeGreaterThan(0)
    }
  })

  it('produces a url-safe unique slug per task id', () => {
    const a = generateBlogPost({ topicKey: 'product-update', taskId: 'task-aaa', companyName: 'Aurora Labs' })
    const b = generateBlogPost({ topicKey: 'product-update', taskId: 'task-bbb', companyName: 'Aurora Labs' })
    expect(a.slug).not.toBe(b.slug)
    expect(a.slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('produces a deterministic thumbnail url keyed by task id', () => {
    const post = generateBlogPost({ topicKey: 'product-update', taskId: 'task-xyz', companyName: 'Aurora Labs' })
    expect(post.thumbnailUrl).toBe('https://picsum.photos/seed/task-xyz/800/450')
  })

  it('throws on an unknown topic key', () => {
    expect(() =>
      generateBlogPost({ topicKey: 'not-a-real-topic', taskId: 'task-1', companyName: 'Aurora Labs' })
    ).toThrow()
  })
})
