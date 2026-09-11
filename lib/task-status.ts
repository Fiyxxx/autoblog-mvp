export type TaskStatus = 'queued' | 'generating' | 'completed'

export interface TaskTimestamps {
  queuedAt: Date
  generatingAt: Date
  completedAt: Date
}

export function deriveStatus(timestamps: TaskTimestamps, now: Date = new Date()): TaskStatus {
  if (now >= timestamps.completedAt) return 'completed'
  if (now >= timestamps.generatingAt) return 'generating'
  return 'queued'
}
