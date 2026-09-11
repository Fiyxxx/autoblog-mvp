import { TaskList } from '@/components/admin/TaskList'
import { StatsDashboard } from '@/components/admin/StatsDashboard'
import { getBlogStats } from '@/lib/stats'
import { listTasksWithStatus } from '@/lib/tasks'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [tasks, stats] = await Promise.all([listTasksWithStatus(), getBlogStats()])

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Content tasks</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Start the day to generate today&apos;s batch of posts.
      </p>
      <StatsDashboard stats={stats} />
      <TaskList key={tasks[0]?.id ?? 'empty'} initialTasks={tasks} />
    </div>
  )
}
