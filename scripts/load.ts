import { promises as fs } from 'fs'
import path from 'path'
import readline from 'readline'
import { PrismaClient, Feed } from '@prisma/client'

import type { Dirent } from 'fs'


const prisma = new PrismaClient()
const rootDir = './data'
const datePattern = /\d{4}-\d{2}-\d{2}/

const readToFeeds = async (dirent: Dirent) => {
  const buf = await fs.readFile(path.join(rootDir, dirent.name))
  const feeds: Omit<Feed, 'id'>[] = buf.toString().split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split("|"))
    .filter(item => item.length > 1)
    .map(([url, ...rest]) => ({
      title: rest.join('|').trim(),
      url: url.trim(),
    })).map(({ title, url }) => ({
      title, url,
      date: dirent.name.match(datePattern).find(elm => elm.length > 0) ?? '',
      domain: (new URL(url)).hostname
    }))

  return feeds
}

const main = async () => {

  const dirents = await fs.readdir(rootDir, { withFileTypes: true })

  const feeds: Omit<Feed, "id">[] = (await Promise.all(dirents
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.txt'))
    .map(readToFeeds)))
    .flat()

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
    .forEach(line => console.log(line))
  // console.log(feeds[0])
}

main()
  .catch(e => { throw e })
  .finally(async () => {
    await prisma.$disconnect()
  })
