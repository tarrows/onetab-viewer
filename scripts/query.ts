import { PrismaClient, Feed } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const item = await prisma.feed.findMany({
    where: {
      domain: {
        contains: 'twitter',
      },
    },
    select: {
      title: true,
      domain: true,
    },
  })
  console.log(item.slice(0, 10))
}

main()
  .catch(e => { throw e })
  .finally(async () => { await prisma.$disconnect() })
