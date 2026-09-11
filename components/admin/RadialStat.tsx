export function RadialStat({ label, percent, caption }: { label: string; percent: number; caption: string }) {
  const clamped = Math.max(0, Math.min(100, percent))
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped / 100)

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 64 64" aria-hidden className="size-14 shrink-0 -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-secondary" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-foreground"
        />
      </svg>
      <div>
        <p className="text-lg font-semibold tracking-tight">{Math.round(clamped)}%</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
    </div>
  )
}
