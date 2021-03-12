import React from 'react'
import type { NextPage, GetStaticProps } from 'next'

import { PrismaClient, Story } from "@prisma/client"
import { Stories } from '../components/Stories'

type Props = {
  stories: Story[]
}

const IndexPage: NextPage<Props> = (props) => (
  <Stories stories={props.stories} />
)

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient()
  const stories = await prisma.story.findMany({ take: 10 })
  const props = { stories }

  return { props }
}

export default IndexPage
