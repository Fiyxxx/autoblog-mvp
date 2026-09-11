'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TaskStatusBadge } from './TaskStatusBadge'
import { ToastStack, useToasts } from './Toast'
import { fetchJson } from '@/lib/fetch-json'
import type { TaskListItem } from '@/lib/tasks'

const POLL_INTERVAL_MS = 2000

export function TaskList({ initialTasks }: { initialTasks: TaskListItem[] }) {
  const router = useRouter()
  const [tasks, setTasks] = useState(initialTasks)
  const [restarting, setRestarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toasts, push } = useToasts()
  const previousStatuses = useRef(new Map(initialTasks.map((task) => [task.id, task.status])))

  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const data = await fetchJson<{ tasks: TaskListItem[] }>('/api/tasks', { signal })

        for (const task of data.tasks) {
          const previousStatus = previousStatuses.current.get(task.id)
          if (previousStatus && previousStatus !== 'completed' && task.status === 'completed') {
            push(`Filed: ${task.postTitle ?? task.prompt}`)
          }
        }

        previousStatuses.current = new Map(data.tasks.map((task) => [task.id, task.status]))
        setTasks(data.tasks)
        setError(null)
        return data.tasks
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return null
        setError(cause instanceof Error ? cause.message : 'Unable to refresh tasks')
        return null
      }
    },
    [push]
  )

  const hasActiveTasks = tasks.some((task) => task.status !== 'completed')

  useEffect(() => {
    if (!hasActiveTasks) return

    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined

    const poll = async () => {
      await refresh(controller.signal)
      if (!controller.signal.aborted) timer = setTimeout(poll, POLL_INTERVAL_MS)
    }

    timer = setTimeout(poll, POLL_INTERVAL_MS)

    return () => {
      controller.abort()
      if (timer) clearTimeout(timer)
    }
  }, [hasActiveTasks, refresh])

  async function handleStartDay() {
    if (
      tasks.length > 0 &&
      !window.confirm('This starts a new batch and keeps the current run in History. Continue?')
    ) {
      return
    }

    setRestarting(true)
    setError(null)

    try {
      await fetchJson('/api/tasks/restart-day', { method: 'POST' })
      await refresh()
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start a new run')
    } finally {
      setRestarting(false)
    }
  }

  return (
    <div>
      <ToastStack toasts={toasts} />
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </p>
        <button
          type="button"
          onClick={handleStartDay}
          disabled={restarting}
          className="rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {restarting ? 'Starting…' : tasks.length > 0 ? 'Restart day' : 'Start day'}
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {tasks.length === 0 ? (
        <p className="border-t border-border py-10 text-center text-sm text-muted-foreground">
          No tasks yet — start the day to generate today’s posts.
        </p>
      ) : (
        <ul className="border-t border-border">
          {tasks.map((task, index) => (
            <li
              key={task.id}
              className={`border-b border-border ${task.status !== 'completed' ? 'animate-pulse' : ''}`}
            >
              <Link
                href={`/admin/tasks/${task.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4 transition-colors hover:bg-secondary/50"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
                  {task.topic}
                </span>
                <span className="min-w-0 flex-1 basis-full truncate sm:basis-auto">{task.prompt}</span>
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{task.author.name}</span>
                <TaskStatusBadge status={task.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
