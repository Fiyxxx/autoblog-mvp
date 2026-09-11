import Link from 'next/link'
import { COMPANY_NAME } from '@/lib/constants'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <header className="flex items-center justify-between border-b border-border py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {COMPANY_NAME}
        </Link>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
          Admin
        </Link>
      </header>
      <main className="pt-10">{children}</main>
    </div>
  )
}
