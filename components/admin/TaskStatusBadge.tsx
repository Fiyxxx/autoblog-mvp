import type { TaskStatus } from '@/lib/task-status'

const LABELS: Record<TaskStatus, string> = {
  queued: 'QUEUED',
  generating: 'GENERATING',
  completed: 'FILED',
}

const DOT_COLOR: Record<TaskStatus, string> = {
  queued: 'bg-signal-queued',
  generating: 'bg-signal-generating animate-pulse',
  completed: 'bg-signal-completed',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-muted-foreground">
      <span className={`size-1.5 rounded-full ${DOT_COLOR[status]}`} aria-hidden />
      {LABELS[status]}
    </span>
  )
}
