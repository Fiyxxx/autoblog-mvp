import Link from 'next/link'
import { RadialStat } from './RadialStat'
import type { BlogStats } from '@/lib/stats'

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 px-4 py-3 first:pl-0 last:pr-0">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function StatsDashboard({ stats }: { stats: BlogStats }) {
  if (stats.totalPosts === 0) return null

  const activeRate = (stats.activeCount / stats.totalPosts) * 100
  const engagementRate = 100 - stats.avgBounceRate

  return (
    <section aria-label="Blog performance" className="mb-8 border-y border-border py-5">
      <div className="flex flex-wrap divide-x divide-border">
        <StatCell label="Total posts" value={stats.totalPosts} />
        <StatCell label="Active" value={stats.activeCount} />
        <StatCell label="Archived" value={stats.archivedCount} />
        <StatCell label="Total views (simulated)" value={stats.totalViews.toLocaleString()} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-8 border-t border-border pt-5">
        <RadialStat label="Active rate" percent={activeRate} caption={`${stats.activeCount} of ${stats.totalPosts} posts`} />
        <RadialStat label="Avg engagement" percent={engagementRate} caption={`${stats.avgBounceRate}% bounce rate`} />
        {stats.bestPerforming && (
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Best performing</p>
            <Link
              href={`/blog/${stats.bestPerforming.slug}`}
              className="block max-w-xs truncate text-sm font-medium hover:underline"
            >
              {stats.bestPerforming.title}
            </Link>
            <p className="text-xs text-muted-foreground">{stats.bestPerforming.views.toLocaleString()} views</p>
          </div>
        )}
      </div>
    </section>
  )
}
