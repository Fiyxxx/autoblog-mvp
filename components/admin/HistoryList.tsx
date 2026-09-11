'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchJson } from '@/lib/fetch-json'
import type { RunPostItem, RunSummary } from '@/lib/tasks'

type SerializedRunSummary = Omit<RunSummary, 'startedAt'> & { startedAt: string }

function formatRunDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function RunPosts({
  runId,
  onArchiveChange,
}: {
  runId: string
  onArchiveChange: (wasArchived: boolean) => void
}) {
  const [posts, setPosts] = useState<RunPostItem[] | null>(null)
  const [pendingIds, setPendingIds] = useState(new Set<string>())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchJson<{ posts: RunPostItem[] }>(`/api/runs/${runId}/posts`, { signal: controller.signal })
      .then((data) => setPosts(data.posts))
      .catch((cause) => {
        if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
          setError(cause instanceof Error ? cause.message : 'Unable to load posts')
        }
      })

    return () => controller.abort()
  }, [runId])

  async function toggleArchived(post: RunPostItem) {
    setPendingIds((current) => new Set(current).add(post.postId))
    setError(null)

    try {
      const updated = await fetchJson<{ id: string; archived: boolean }>(`/api/posts/${post.postId}/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !post.archived }),
      })
      setPosts((current) =>
        current?.map((item) => (item.postId === post.postId ? { ...item, archived: updated.archived } : item)) ?? null
      )
      onArchiveChange(post.archived)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update post')
    } finally {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(post.postId)
        return next
      })
    }
  }

  if (posts === null && !error) return <p className="py-4 text-sm text-muted-foreground">Loading…</p>

  return (
    <div id={`run-${runId}-posts`}>
      {error && (
        <p role="alert" className="py-4 text-sm text-destructive">
          {error}
        </p>
      )}
      {posts?.length === 0 && <p className="py-4 text-sm text-muted-foreground">No posts in this run.</p>}
      {posts && posts.length > 0 && (
        <ul className="divide-y divide-border border-t border-border">
          {posts.map((post) => (
            <li key={post.postId} className="flex flex-wrap items-center gap-3 py-3">
              <span className="min-w-0 flex-1 basis-full truncate sm:basis-auto">
                <Link href={`/admin/tasks/${post.taskId}`} className="hover:underline">
                  {post.title}
                </Link>
              </span>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-ink-soft">
                {post.tags[0] ?? 'Article'}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">{post.author.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {post.views.toLocaleString()} views · {post.bounceRate}% bounce
              </span>
              <span className={`shrink-0 text-xs ${post.archived ? 'text-muted-foreground' : 'text-foreground'}`}>
                {post.archived ? 'Archived' : 'Active'}
              </span>
              <button
                type="button"
                onClick={() => toggleArchived(post)}
                disabled={pendingIds.has(post.postId)}
                className="shrink-0 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-secondary disabled:opacity-50"
              >
                {post.archived ? 'Unarchive' : 'Archive'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function HistoryList({ initialRuns }: { initialRuns: SerializedRunSummary[] }) {
  const [runs, setRuns] = useState(initialRuns)
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null)

  function updateCounts(runId: string, wasArchived: boolean) {
    setRuns((current) =>
      current.map((run) =>
        run.id === runId
          ? {
              ...run,
              activePostCount: run.activePostCount + (wasArchived ? 1 : -1),
              archivedPostCount: run.archivedPostCount + (wasArchived ? -1 : 1),
            }
          : run
      )
    )
  }

  if (runs.length === 0) {
    return <p className="border-t border-border py-10 text-center text-sm text-muted-foreground">No runs yet.</p>
  }

  return (
    <ul className="border-t border-border">
      {runs.map((run) => {
        const expanded = expandedRunId === run.id
        return (
          <li key={run.id} className="border-b border-border py-4">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`run-${run.id}-posts`}
              onClick={() => setExpandedRunId(expanded ? null : run.id)}
              className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
            >
              <span className="font-medium">{formatRunDate(run.startedAt)}</span>
              <span className="text-xs text-muted-foreground">
                {run.taskCount} posts · {run.activePostCount} active · {run.archivedPostCount} archived
              </span>
            </button>
            {expanded && <RunPosts runId={run.id} onArchiveChange={(value) => updateCounts(run.id, value)} />}
          </li>
        )
      })}
    </ul>
  )
}
