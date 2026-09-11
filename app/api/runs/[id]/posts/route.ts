import { NextResponse } from 'next/server'
import { listPostsForRun } from '@/lib/tasks'

export async function GET(_request: Request, context: RouteContext<'/api/runs/[id]/posts'>) {
  const { id } = await context.params
  const posts = await listPostsForRun(id)

  if (!posts) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 })
  }

  return NextResponse.json({ posts })
}
