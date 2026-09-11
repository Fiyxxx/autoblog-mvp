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

  if (!task) return <p className="font-mono text-xs text-muted-foreground">loading…</p>

  return (
    <div className="flex flex-col gap-10">
      <section className="border border-border p-6">
        <div className="mb-4 flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span className="uppercase tracking-wide text-ink-soft">{task.topic}</span>
          <TaskStatusBadge status={task.status} />
        </div>
        <dl className="mb-5 grid grid-cols-3 gap-3 border-y border-border py-3 font-mono text-[0.7rem] text-muted-foreground">
          <div>
            <dt className="uppercase tracking-wide">Queued</dt>
            <dd className="text-ink-soft">{new Date(task.queuedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Writing</dt>
            <dd className="text-ink-soft">{new Date(task.generatingAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Filed</dt>
            <dd className="text-ink-soft">{new Date(task.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</dd>
          </div>
        </dl>
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">Assignment</p>
        <p className="font-serif text-lg">{task.prompt}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">— {task.author.name}</p>
      </section>

      {task.post && (
        <section>
          <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-wide text-muted-foreground">
            <span>{task.status === 'completed' ? 'Filed copy' : 'Draft in progress'}</span>
            {task.status === 'completed' && (
              <Link href={`/blog/${task.post.slug}`} className="text-brass normal-case tracking-normal hover:underline">
                View on the wire
              </Link>
            )}
          </div>
          <div className="bg-card p-6">
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
          </div>
        </section>
      )}
    </div>
  )
}
