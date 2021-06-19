import { promises as fs } from 'fs'
import path from 'path'
import readline from 'readline'
import { PrismaClient, Feed } from '@prisma/client'

import type { Dirent } from 'fs'


const prisma = new PrismaClient()
const rootDir = process.env.DATA_DIR
const datePattern = /\d{4}-\d{2}-\d{2}/


const parseToFeeds = (text: string, dateYMD: string): Omit<Feed, 'id'>[] => {
  const parseTargetLines = text.split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split("|"))
    .filter(item => item.length > 1)

  const feeds = parseTargetLines
    .map(([url, ...rest]) => ({
      title: rest.join('|').trim(),
      url: url.trim(),
    }))
    .map(({ title, url }) => ({
      title, url,
      date: dateYMD,
      domain: (new URL(url)).hostname,
    }))

  return feeds
}


const readToFeeds = async (dirent: Dirent) => {
  const buf = await fs.readFile(path.join(rootDir, dirent.name))
  const dateYMD = dirent.name.match(datePattern).find(elm => elm.length > 0) ?? ''
  const feeds: Omit<Feed, 'id'>[] = parseToFeeds(buf.toString(), dateYMD)

  return feeds
}

const main = async () => {

  const dirents = await fs.readdir(rootDir, { withFileTypes: true })

  const feeds: Omit<Feed, "id">[] = (await Promise.all(dirents
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.txt'))
    .map(readToFeeds)))
    .flat()

  await prisma.feed.deleteMany({})

  const results = await Promise.all(feeds
    .map(async feed => {
      try {
        return await prisma.feed.create({
          data: feed
        })
      } catch (err) {
        console.error(err)
      }
    }))

  results
    .filter(item => Boolean(item))
    .map(item => `[${item.id}] ${item.title}`)
    .slice(0, 3)
    .forEach(line => console.log(line))
  // console.log(feeds[0])
}

main()
  .catch(e => { throw e })
  .finally(async () => {
    await prisma.$disconnect()
  })
