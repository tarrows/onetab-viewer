import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const story = await prisma.story.findFirst()
  console.log(story)
}

main()
  .catch(e => { throw e })
  .finally(async () => { await prisma.$disconnect() })
