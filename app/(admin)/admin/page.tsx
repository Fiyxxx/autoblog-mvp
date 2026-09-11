import { TaskList } from '@/components/admin/TaskList'

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Today&apos;s Tasks</h1>
      <TaskList />
    </div>
  )
}
