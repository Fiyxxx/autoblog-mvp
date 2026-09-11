import type { TaskStatus } from '@/lib/task-status'

const LABELS: Record<TaskStatus, string> = {
  queued: 'QUEUED',
  generating: 'GENERATING',
  completed: 'FILED',
}

// Status reads through shape and motion, not color — the dashboard is
// strictly black/white/gray: an empty ring, a pulsing filled dot, a
// checkmark. No two states differ only by hue.
function StatusMark({ status }: { status: TaskStatus }) {
  if (status === 'completed') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden className="size-3 shrink-0 text-foreground">
        <path
          d="M3 8.5L6.2 11.5L13 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (status === 'generating') {
    return <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-foreground" aria-hidden />
  }
  return <span className="size-1.5 shrink-0 rounded-full border border-muted-foreground" aria-hidden />
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-wide text-muted-foreground">
      <StatusMark status={status} />
      {LABELS[status]}
    </span>
  )
}
