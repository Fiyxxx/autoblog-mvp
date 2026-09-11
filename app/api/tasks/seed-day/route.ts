import { NextResponse } from 'next/server'
import { createDailyTasks } from '@/lib/tasks'

export async function POST() {
  const result = await createDailyTasks()
  return NextResponse.json(result)
}
