import { NextResponse } from 'next/server'
import { getTaskWithPost } from '@/lib/tasks'

export async function GET(_request: Request, context: RouteContext<'/api/tasks/[id]'>) {
  const { id } = await context.params
  const task = await getTaskWithPost(id)

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json(task)
}
