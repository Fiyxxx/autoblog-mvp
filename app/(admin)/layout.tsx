export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <nav className="mb-6 text-sm text-muted-foreground">Admin</nav>
      {children}
    </div>
  )
}
