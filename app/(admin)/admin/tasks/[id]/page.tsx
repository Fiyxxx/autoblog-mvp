import { notFound } from 'next/navigation'
import { TaskDetail } from '@/components/admin/TaskDetail'
import { getTaskWithPost } from '@/lib/tasks'

export const dynamic = 'force-dynamic'

export default async function TaskDetailPage({ params }: PageProps<'/admin/tasks/[id]'>) {
  const { id } = await params
  const task = await getTaskWithPost(id)

  if (!task) notFound()

  return (
    <TaskDetail
      initialTask={{
        ...task,
        queuedAt: task.queuedAt.toISOString(),
        generatingAt: task.generatingAt.toISOString(),
        completedAt: task.completedAt.toISOString(),
      }}
    />
  )
}
