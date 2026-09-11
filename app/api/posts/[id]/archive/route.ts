import { NextResponse } from 'next/server'
import { setPostArchived } from '@/lib/posts'

export async function POST(request: Request, context: RouteContext<'/api/posts/[id]/archive'>) {
  const { id } = await context.params
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || !('archived' in body) || typeof body.archived !== 'boolean') {
    return NextResponse.json({ error: 'archived must be a boolean' }, { status: 400 })
  }

  const result = await setPostArchived(id, body.archived)

  if (!result) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(result)
}
