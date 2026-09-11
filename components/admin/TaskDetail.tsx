'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TaskStatusBadge } from './TaskStatusBadge'
import { PostReader } from '@/components/blog/PostReader'
import type { TaskStatus } from '@/lib/task-status'

interface TaskDetailData {
  id: string
  prompt: string
  topic: string
  status: TaskStatus
  queuedAt: string
  generatingAt: string
  completedAt: string
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

export function TaskDetail({ taskId }: { taskId: string }) {
  const [task, setTask] = useState<TaskDetailData | null>(null)

  useEffect(() => {
    let cancelled = false
    function refresh() {
      fetch(`/api/tasks/${taskId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setTask(data)
        })
    }
    refresh()
    const timer = setInterval(refresh, 2000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [taskId])

  if (!task) return <p className="text-muted-foreground">Loading…</p>

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-2 flex items-center gap-3">
          <TaskStatusBadge status={task.status} />
          <span className="text-sm text-muted-foreground">{task.author.name}</span>
        </div>
        <h2 className="mb-1 text-lg font-semibold">Prompt</h2>
        <p>{task.prompt}</p>
      </section>

      {task.post && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{task.status === 'completed' ? 'Published Preview' : 'Draft Preview'}</h2>
            {task.status === 'completed' && (
              <Link href={`/blog/${task.post.slug}`} className="text-sm underline">
                View live
              </Link>
            )}
          </div>
          <PostReader
            post={{
              title: task.post.title,
              companyName: task.post.companyName,
              authorName: task.author.name,
              authorAvatarUrl: task.author.avatarUrl,
              publishedAt: new Date(task.completedAt),
              thumbnailUrl: task.post.thumbnailUrl,
              contentMd: task.post.contentMd,
            }}
          />
        </section>
      )}
    </div>
  )
}
