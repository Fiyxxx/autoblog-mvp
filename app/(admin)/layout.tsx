import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wire min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between px-6 py-4 font-mono text-xs tracking-wide text-muted-foreground">
          <Link href="/admin" className="text-brass">
            AURORA WIRE
          </Link>
          <span>INTERNAL / DESK COPY</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  )
}
