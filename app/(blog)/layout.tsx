import Link from 'next/link'
import { COMPANY_NAME } from '@/lib/constants'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-10">
        <Link href="/" className="text-xl font-bold">
          {COMPANY_NAME} Blog
        </Link>
      </header>
      {children}
    </div>
  )
}
