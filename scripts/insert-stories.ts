import { promises as fs } from 'fs'
import path from 'path'
import type { Dirent } from 'fs'
import { PrismaClient, Story } from '@prisma/client'

const prisma = new PrismaClient()
const rootDir = './data'

const verify = (data: unknown): data is Story => {
  return data['id'] &&
    data['type'] &&
    data['title'] &&
    data['by'] &&
    data['time'] &&
    data['score'] &&
    data['url']
}

const drop = (data: Story) => ({
  id: data.id,
  type: data.type,
  title: data.title,
  by: data.by,
  time: data.time,
  score: data.score,
  url: data.url
})

const readJSON = async (dirent: Dirent) => {
  const buf = await fs.readFile(path.join(rootDir, dirent.name))
  const data = JSON.parse(buf.toString())

  return data
}

const main = async () => {

  const dirents = await fs.readdir(rootDir, { withFileTypes: true })

  const jsons = await Promise.all(dirents
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.json'))
    .map(readJSON))

  const stories = jsons.filter(verify).map(drop)

  const results = await Promise.all(stories
    .map(async story => {
      try {
        return await prisma.story.create({
          data: story
        })
      } catch (err) {
        console.error(err)
      }
    }))

  results
    .filter(item => Boolean(item))
    .map(story => `[${story.id}] ${story.title}`)
    .forEach(line => console.log(line))
}

main()
  .catch(e => { throw e })
  .finally(async () => {
    await prisma.$disconnect()
  })
