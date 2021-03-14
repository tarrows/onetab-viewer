import { promises as fs } from 'fs'
import path from 'path'
import readline from 'readline'
import { PrismaClient, Feed } from '@prisma/client'

import type { Dirent } from 'fs'


const prisma = new PrismaClient()
const rootDir = './data'

const readToFeeds = async (dirent: Dirent) => {
  const buf = await fs.readFile(path.join(rootDir, dirent.name))
  const feeds = buf.toString().split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split("|"))
    .filter(item => item.length > 1)
    .map(([url, ...rest]) => ({
      title: rest.join('|').trim(),
      url: url.trim(),
    }))

  return feeds
}

const main = async () => {

  const dirents = await fs.readdir(rootDir, { withFileTypes: true })

  const feeds = (await Promise.all(dirents
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.txt'))
    .map(readToFeeds)))
    .flat()

  // const results = await Promise.all(stories
  //   .map(async story => {
  //     try {
  //       return await prisma.story.create({
  //         data: story
  //       })
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }))

  // results
  //   .filter(item => Boolean(item))
  //   .map(story => `[${story.id}] ${story.title}`)
  //   .forEach(line => console.log(line))
  console.log(feeds[0])
}

main()
  .catch(e => { throw e })
  .finally(async () => {
    await prisma.$disconnect()
  })
