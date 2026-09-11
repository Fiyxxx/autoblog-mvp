import { HistoryList } from '@/components/admin/HistoryList'
import { listRuns } from '@/lib/tasks'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const runs = await listRuns()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">History</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Every run, by date. Archive a post to pull it off the public blog without deleting it.
      </p>
      <HistoryList initialRuns={runs.map((run) => ({ ...run, startedAt: run.startedAt.toISOString() }))} />
    </div>
  )
}
