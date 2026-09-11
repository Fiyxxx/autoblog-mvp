export function BlogMasthead({ description }: { description: string }) {
  return (
    <div className="flex flex-col justify-between gap-4 pb-10 sm:flex-row sm:items-start">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
      <p className="max-w-xs text-sm text-muted-foreground sm:pt-2 sm:text-right">{description}</p>
    </div>
  )
}
