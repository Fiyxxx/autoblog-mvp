import { Badge } from '@/components/ui/badge'
import type { TaskStatus } from '@/lib/task-status'

const LABELS: Record<TaskStatus, string> = {
  queued: 'Queued',
  generating: 'Generating',
  completed: 'Completed',
}

const VARIANTS: Record<TaskStatus, 'secondary' | 'default' | 'outline'> = {
  queued: 'outline',
  generating: 'secondary',
  completed: 'default',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>
}
