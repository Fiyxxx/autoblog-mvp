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
    return <p className="text-muted-foreground">Waiting for today&apos;s tasks…</p>
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-lg border p-4">
          <Link href={`/admin/tasks/${task.id}`} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{task.topic}</p>
              <p className="text-sm text-muted-foreground">{task.author.name}</p>
            </div>
            <TaskStatusBadge status={task.status} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
