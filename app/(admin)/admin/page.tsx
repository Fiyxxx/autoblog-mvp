import { TaskList } from '@/components/admin/TaskList'

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-medium">Today&apos;s dispatches</h1>
      <p className="mt-1 mb-8 font-mono text-xs text-muted-foreground">
        five assignments go out each morning — filed automatically as the wire clears them
      </p>
      <TaskList />
    </div>
  )
}
