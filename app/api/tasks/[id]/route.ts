import { NextResponse } from 'next/server'
import { getTaskWithPost } from '@/lib/tasks'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const task = await getTaskWithPost(id)

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json(task)
}
