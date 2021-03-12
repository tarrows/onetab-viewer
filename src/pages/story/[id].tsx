import { PrismaClient, Story, Prisma } from '@prisma/client'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import got from 'got'
import { promises as fs } from 'fs'
import path from 'path'

type Props = {
  result: {
    found: true
    story: Story
  } | {
    found: false
  }
}

const StoryPage: NextPage<Props> = (props) => {
  const router = useRouter()
  if (router.isFallback) {
    return <p>fetching...</p>
  }

  if (props.result.found) {
    return (
      <main>
        <h1>{props.result.story.title}</h1>
      </main>
    )
  } else {
    return <p>page not found</p>
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dirents = await fs.readdir(path.join(process.cwd(), 'data'), { withFileTypes: true })
  const paths = dirents
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.json'))
    .map(dirent => dirent.name.replace('.json', ''))
    .map(id => ({
      params: { id }
    }))
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params
  const prisma = new PrismaClient()

  const storyID = parseInt(`${id}`)

  // https://github.com/vercel/next.js/discussions/11464
  if (isNaN(storyID)) {
    const result = { found: false }
    return { props: { result }  }
  }

  const story = await prisma.story.findUnique({ where: { id: storyID } })

  if (Boolean(story)) {
    // console.log(`ID ${id} found in DB!`)
    const result = { found: true, story }
    return { props: { result } }
  }

  try {
    const res = await got(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).json()
    if (res) {
      const result = { found: true, story: res }
      return {
        props: { result }
      }
    }
  } catch (err) {
    console.error(err)
    const result = { found: false }
    return {
      props: { result }
    }
  }

  return {
    props: { result: { found: false } }
  }
}

export default StoryPage
