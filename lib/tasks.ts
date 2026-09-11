import type { Prisma } from '@prisma/client'
import { prisma } from './db'
import { deriveStatus, type TaskStatus } from './task-status'
import { generateBlogPost, TOPICS } from './content-generator'
import { COMPANY_NAME } from './constants'
import { simulatedViews, simulatedBounceRate } from './simulated-metrics'

function randomBetween(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs)
}

async function seedFreshTasks(db: Prisma.TransactionClient, now: Date, runId: string): Promise<string[]> {
  const authors = await db.author.findMany({ orderBy: { name: 'asc' } })
  if (authors.length === 0) {
    throw new Error('No authors seeded — run `pnpm db:seed` first')
  }

  const taskIds: string[] = []

  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i]
    const author = authors[i % authors.length]

    const queuedAt = new Date(now.getTime() + i * 1000)
    const generatingAt = new Date(queuedAt.getTime() + randomBetween(3000, 6000))
    const completedAt = new Date(generatingAt.getTime() + randomBetween(5000, 9000))

    const task = await db.task.create({
      data: {
        prompt: topic.prompt(COMPANY_NAME),
        topic: topic.key,
        runId,
        authorId: author.id,
        queuedAt,
        generatingAt,
        completedAt,
      },
    })

    const generated = generateBlogPost({
      topicKey: topic.key,
      taskId: task.id,
      companyName: COMPANY_NAME,
    })

    await db.blogPost.create({
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

  return taskIds
}

/**
 * Starts a new dated run: creates a Run row and seeds a fresh batch of tasks
 * under it. Never deletes prior runs — those stay as history in the admin
 * view, and their posts remain live on the public blog until individually
 * archived.
 */
export async function restartDay(now: Date = new Date()): Promise<{ runId: string; taskIds: string[] }> {
  return prisma.$transaction(async (transaction) => {
    const run = await transaction.run.create({ data: { startedAt: now } })
    const taskIds = await seedFreshTasks(transaction, now, run.id)
    return { runId: run.id, taskIds }
  })
}

async function getLatestRunId(): Promise<string | null> {
  const run = await prisma.run.findFirst({ orderBy: { startedAt: 'desc' } })
  return run?.id ?? null
}

export interface RunSummary {
  id: string
  startedAt: Date
  taskCount: number
  activePostCount: number
  archivedPostCount: number
}

export async function listRuns(): Promise<RunSummary[]> {
  const runs = await prisma.run.findMany({
    orderBy: { startedAt: 'desc' },
    select: {
      id: true,
      startedAt: true,
      tasks: { select: { post: { select: { archived: true } } } },
    },
  })

  return runs.map((run) => {
    const posts = run.tasks.map((t) => t.post).filter((p): p is { archived: boolean } => p !== null)
    return {
      id: run.id,
      startedAt: run.startedAt,
      taskCount: run.tasks.length,
      activePostCount: posts.filter((p) => !p.archived).length,
      archivedPostCount: posts.filter((p) => p.archived).length,
    }
  })
}

export interface RunPostItem {
  taskId: string
  postId: string
  title: string
  archived: boolean
  author: { name: string }
  tags: string[]
  views: number
  bounceRate: number
}

export async function listPostsForRun(runId: string): Promise<RunPostItem[] | null> {
  const run = await prisma.run.findUnique({
    where: { id: runId },
    select: {
      tasks: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          author: { select: { name: true } },
          post: {
            select: {
              id: true,
              title: true,
              archived: true,
              tags: true,
            },
          },
        },
      },
    },
  })

  if (!run) return null

  return run.tasks
    .filter((task): task is typeof task & { post: NonNullable<typeof task.post> } => task.post !== null)
    .map((task) => ({
      taskId: task.id,
      postId: task.post.id,
      title: task.post.title,
      archived: task.post.archived,
      author: task.author,
      tags: task.post.tags,
      views: simulatedViews(task.post.id),
      bounceRate: simulatedBounceRate(task.post.id),
    }))
}

export interface TaskListItem {
  id: string
  topic: string
  prompt: string
  author: { name: string }
  status: TaskStatus
  postTitle: string | null
}

export async function listTasksWithStatus(now: Date = new Date(), runId?: string): Promise<TaskListItem[]> {
  const resolvedRunId = runId ?? (await getLatestRunId())
  if (!resolvedRunId) return []

  const tasks = await prisma.task.findMany({
    where: { runId: resolvedRunId },
    select: {
      id: true,
      topic: true,
      prompt: true,
      queuedAt: true,
      generatingAt: true,
      completedAt: true,
      author: { select: { name: true } },
      post: { select: { title: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return tasks.map((task) => ({
    id: task.id,
    topic: task.topic,
    prompt: task.prompt,
    author: task.author,
    status: deriveStatus(task, now),
    postTitle: task.post?.title ?? null,
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
    archived: boolean
  } | null
}

export async function getTaskWithPost(id: string, now: Date = new Date()): Promise<TaskWithPost | null> {
  const task = await prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      prompt: true,
      topic: true,
      queuedAt: true,
      generatingAt: true,
      completedAt: true,
      author: { select: { name: true, avatarUrl: true } },
      post: {
        select: {
          title: true,
          slug: true,
          excerpt: true,
          contentMd: true,
          thumbnailUrl: true,
          tags: true,
          companyName: true,
          archived: true,
        },
      },
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
          archived: task.post.archived,
        }
      : null,
  }
}
