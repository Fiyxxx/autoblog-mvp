import { prisma } from './db'
import { deriveStatus, type TaskStatus } from './task-status'
import { generateBlogPost, TOPICS } from './content-generator'
import { COMPANY_NAME } from './constants'

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function randomBetween(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs)
}

export async function createDailyTasks(now: Date = new Date()): Promise<{ created: boolean; taskIds: string[] }> {
  const dayStart = startOfDay(now)
  const existing = await prisma.task.findMany({ where: { createdAt: { gte: dayStart } } })
  if (existing.length > 0) {
    return { created: false, taskIds: existing.map((t) => t.id) }
  }

  const authors = await prisma.author.findMany()
  if (authors.length === 0) {
    throw new Error('No authors seeded — run `pnpm dlx prisma db seed` first')
  }

  const taskIds: string[] = []
  let cursor = now

  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i]
    const author = authors[i % authors.length]

    const queuedAt = cursor
    const generatingAt = new Date(queuedAt.getTime() + randomBetween(3000, 6000))
    const completedAt = new Date(generatingAt.getTime() + randomBetween(5000, 9000))
    cursor = new Date(queuedAt.getTime() + 1000)

    const task = await prisma.task.create({
      data: {
        prompt: `Write a ${topic.label.toLowerCase()} blog post for ${COMPANY_NAME}.`,
        topic: topic.key,
        authorId: author.id,
        queuedAt,
        generatingAt,
        completedAt,
      },
    })

    const generated = generateBlogPost({ topicKey: topic.key, taskId: task.id, companyName: COMPANY_NAME })

    await prisma.blogPost.create({
      data: {
        taskId: task.id,
        title: generated.title,
        slug: generated.slug,
        excerpt: generated.excerpt,
        contentMd: generated.contentMd,
        thumbnailUrl: generated.thumbnailUrl,
        tags: generated.tags,
        authorId: author.id,
        companyName: COMPANY_NAME,
        publishedAt: completedAt,
      },
    })

    taskIds.push(task.id)
  }

  return { created: true, taskIds }
}

export interface TaskListItem {
  id: string
  topic: string
  prompt: string
  author: { name: string }
  status: TaskStatus
  createdAt: Date
}

export async function listTasksWithStatus(now: Date = new Date()): Promise<TaskListItem[]> {
  const tasks = await prisma.task.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  })

  return tasks.map((task) => ({
    id: task.id,
    topic: task.topic,
    prompt: task.prompt,
    author: task.author,
    status: deriveStatus(task, now),
    createdAt: task.createdAt,
  }))
}

export interface TaskWithPost {
  id: string
  prompt: string
  topic: string
  status: TaskStatus
  queuedAt: Date
  generatingAt: Date
  completedAt: Date
  author: { name: string; avatarUrl: string }
  post: {
    title: string
    slug: string
    excerpt: string
    contentMd: string
    thumbnailUrl: string
    tags: string[]
    companyName: string
  } | null
}

export async function getTaskWithPost(id: string, now: Date = new Date()): Promise<TaskWithPost | null> {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, avatarUrl: true } },
      post: true,
    },
  })

  if (!task) return null

  return {
    id: task.id,
    prompt: task.prompt,
    topic: task.topic,
    status: deriveStatus(task, now),
    queuedAt: task.queuedAt,
    generatingAt: task.generatingAt,
    completedAt: task.completedAt,
    author: task.author,
    post: task.post
      ? {
          title: task.post.title,
          slug: task.post.slug,
          excerpt: task.post.excerpt,
          contentMd: task.post.contentMd,
          thumbnailUrl: task.post.thumbnailUrl,
          tags: task.post.tags,
          companyName: task.post.companyName,
        }
      : null,
  }
}
