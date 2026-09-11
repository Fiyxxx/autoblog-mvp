import { NextResponse } from 'next/server'
import { restartDay } from '@/lib/tasks'

export async function POST() {
  const result = await restartDay()
  return NextResponse.json(result)
}
