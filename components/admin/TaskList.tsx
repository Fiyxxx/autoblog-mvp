'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TaskStatusBadge } from './TaskStatusBadge'
import type { TaskStatus } from '@/lib/task-status'

interface TaskListItem {
  id: string
  topic: string
  prompt: string
  author: { name: string }
  status: TaskStatus
  createdAt: string
}

export function TaskList() {
  const [tasks, setTasks] = useState<TaskListItem[] | null>(null)

  useEffect(() => {
    const seedTimer = setTimeout(() => {
      fetch('/api/tasks/seed-day', { method: 'POST' }).then(() => {
        refresh()
      })
    }, 5000)

    function refresh() {
      fetch('/api/tasks')
        .then((res) => res.json())
        .then((data) => setTasks(data.tasks))
    }

    refresh()
    const pollTimer = setInterval(refresh, 2000)

    return () => {
      clearTimeout(seedTimer)
      clearInterval(pollTimer)
    }
  }, [])

  if (tasks === null || tasks.length === 0) {
    return (
      <p className="border-t border-border py-6 font-mono text-xs text-muted-foreground">
        waiting for today&apos;s tasks…
      </p>
    )
  }

  return (
    <ul className="border-t border-border">
      {tasks.map((task, index) => (
        <li key={task.id} className="border-b border-border">
          <Link
            href={`/admin/tasks/${task.id}`}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4 transition-colors hover:bg-secondary/50"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-ink-soft">
              {task.topic}
            </span>
            <span className="min-w-0 flex-1 basis-full truncate font-serif sm:basis-auto">{task.prompt}</span>
            <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">{task.author.name}</span>
            <TaskStatusBadge status={task.status} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
