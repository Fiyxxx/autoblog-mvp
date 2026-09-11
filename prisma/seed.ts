import { prisma } from '../lib/db'

const AUTHORS = [
  { name: 'Priya Nathan', avatarUrl: 'https://i.pravatar.cc/150?u=priya-nathan', role: 'Content Lead' },
  { name: 'Marcus Webb', avatarUrl: 'https://i.pravatar.cc/150?u=marcus-webb', role: 'Product Marketing' },
  { name: 'Sofia Álvarez', avatarUrl: 'https://i.pravatar.cc/150?u=sofia-alvarez', role: 'Engineering' },
  { name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/150?u=jordan-lee', role: 'Customer Success' },
]

async function main() {
  for (const author of AUTHORS) {
    await prisma.author.upsert({
      where: { name: author.name },
      update: {},
      create: author,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
