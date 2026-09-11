'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { TaskStatusBadge } from './TaskStatusBadge'
import { Skeleton } from './Skeleton'
import { PostReader } from '@/components/blog/PostReader'
import { fetchJson } from '@/lib/fetch-json'
import type { TaskWithPost } from '@/lib/tasks'

export type TaskDetailData = Omit<TaskWithPost, 'queuedAt' | 'generatingAt' | 'completedAt'> & {
  queuedAt: string
  generatingAt: string
  completedAt: string
}

const POLL_INTERVAL_MS = 2000

function useTaskPolling(initialTask: TaskDetailData) {
  const [task, setTask] = useState(initialTask)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (task.status === 'completed') return

    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined

    const poll = async () => {
      try {
        const nextTask = await fetchJson<TaskDetailData>(`/api/tasks/${initialTask.id}`, {
          signal: controller.signal,
        })
        setTask(nextTask)
        setError(null)
      } catch (cause) {
        if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
          setError(cause instanceof Error ? cause.message : 'Unable to refresh task')
        }
      }

      if (!controller.signal.aborted) timer = setTimeout(poll, POLL_INTERVAL_MS)
    }

    timer = setTimeout(poll, POLL_INTERVAL_MS)

    return () => {
      controller.abort()
      if (timer) clearTimeout(timer)
    }
  }, [initialTask.id, task.status])

  return { task, error }
}

function StreamingDraft({ title, contentMd, done }: { title: string; contentMd: string; done: boolean }) {
  return (
    <article className="mx-auto max-w-2xl">
      <h1 className="mb-5 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
      <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-[1.0625rem] prose-p:leading-[1.7]">
        <ReactMarkdown>{contentMd}</ReactMarkdown>
        {!done && <span className="ml-0.5 inline-block h-5 w-2 animate-pulse bg-foreground align-middle" aria-hidden />}
      </div>
    </article>
  )
}

function ContentStream({ task }: { task: TaskDetailData & { post: NonNullable<TaskDetailData['post']> } }) {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const source = new EventSource(`/api/tasks/${task.id}/stream`)

    source.addEventListener('chunk', (event) => {
      try {
        const chunk: unknown = JSON.parse((event as MessageEvent).data)
        if (typeof chunk === 'string') setText((current) => current + chunk)
      } catch {
        setError('The content stream returned invalid data')
        source.close()
      }
    })
    source.addEventListener('done', () => {
      setDone(true)
      source.close()
    })
    source.onerror = () => {
      setError('The content stream was interrupted')
      source.close()
    }

    return () => source.close()
  }, [task.id])

  return (
    <>
      <StreamingDraft title={task.post.title} contentMd={text} done={done} />
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
    </>
  )
}

export function TaskDetail({ initialTask }: { initialTask: TaskDetailData }) {
  const { task, error } = useTaskPolling(initialTask)
  const copyStatus =
    task.status === 'completed'
      ? `Filed copy${task.post?.archived ? ' · Archived' : ''}`
      : task.status === 'generating'
        ? 'Writing…'
        : 'Queued'

  return (
    <div className="flex flex-col gap-10">
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <section className="border border-border p-6">
        <div className="mb-4 flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span className="uppercase tracking-wide text-ink-soft">{task.topic}</span>
          <TaskStatusBadge status={task.status} />
        </div>
        <dl className="mb-5 grid grid-cols-3 gap-3 border-y border-border py-3 font-mono text-[0.7rem] text-muted-foreground">
          <div>
            <dt className="uppercase tracking-wide">Queued</dt>
            <dd className="text-ink-soft">{formatTime(task.queuedAt)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Writing</dt>
            <dd className="text-ink-soft">{formatTime(task.generatingAt)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Filed</dt>
            <dd className="text-ink-soft">{formatTime(task.completedAt)}</dd>
          </div>
        </dl>
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">Assignment</p>
        <p className="text-lg">{task.prompt}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">— {task.author.name}</p>
      </section>

      {task.post && (
        <section>
          <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-wide text-muted-foreground">
            <span>{copyStatus}</span>
            {task.status === 'completed' && !task.post.archived && (
              <Link href={`/blog/${task.post.slug}`} className="normal-case tracking-normal text-foreground hover:underline">
                View published post →
              </Link>
            )}
          </div>
          <div className="border border-border p-6">
            {task.status === 'queued' && (
              <div className="mx-auto flex max-w-2xl flex-col gap-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
            {task.status === 'generating' && <ContentStream task={{ ...task, post: task.post }} />}
            {task.status === 'completed' && (
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
            )}
          </div>
        </section>
      )}
    </div>
  )
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
