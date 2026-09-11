import { NextResponse } from 'next/server'
import { listTasksWithStatus } from '@/lib/tasks'

export async function GET() {
  const tasks = await listTasksWithStatus()
  return NextResponse.json({ tasks })
}
