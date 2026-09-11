import Link from 'next/link'
import { COMPANY_NAME } from '@/lib/constants'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-20">
      <header className="border-b-4 border-double border-foreground py-10 text-center">
        <Link href="/" className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          {COMPANY_NAME}
        </Link>
        <p className="mt-2 font-mono text-xs tracking-wide text-muted-foreground">
          dispatches on product, engineering &amp; the work — written the same day it happens
        </p>
      </header>
      <main className="pt-12">{children}</main>
    </div>
  )
}
