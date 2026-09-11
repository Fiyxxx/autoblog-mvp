import Link from 'next/link'

export function CategoryTabs({ tags, activeTag }: { tags: string[]; activeTag?: string }) {
  return (
    <nav aria-label="Filter by category" className="border-b border-border">
      <ul className="-mb-px flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <Link
            href="/"
            aria-current={!activeTag ? 'page' : undefined}
            className={`inline-block border-b-2 pb-3 text-sm font-semibold ${
              !activeTag ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            View all
          </Link>
        </li>
        {tags.map((tag) => (
          <li key={tag}>
            <Link
              href={`/?tag=${encodeURIComponent(tag)}`}
              aria-current={activeTag === tag ? 'page' : undefined}
              className={`inline-block border-b-2 pb-3 text-sm font-semibold ${
                activeTag === tag
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
