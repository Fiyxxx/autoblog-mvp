import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Content Ops',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-sm font-semibold tracking-tight">
            Aurora Labs <span className="font-normal text-muted-foreground">/ Content Ops</span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/admin/history" className="text-sm text-muted-foreground hover:text-foreground">
              History
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              View blog
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  )
}
