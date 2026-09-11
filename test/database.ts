import { prisma } from '@/lib/db'

export async function resetContent(): Promise<void> {
  await prisma.blogPost.deleteMany()
  await prisma.task.deleteMany()
  await prisma.run.deleteMany()
}

export async function cleanupDatabase(): Promise<void> {
  await resetContent()
  await prisma.$disconnect()
}
