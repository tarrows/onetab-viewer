import React from 'react'
import type { NextPage, GetStaticProps } from 'next'
import { PrismaClient, Feed } from "@prisma/client"
import { Box } from "@chakra-ui/react"
import { Container } from "@chakra-ui/react"
import { Heading } from '@chakra-ui/react'
import { Stack } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"

type Props = {
  count: number
  feeds: Feed[]
}

const IndexPage: NextPage<Props> = (props) => (
  <main>
    <Container maxW="container.xl">
      <Heading>{props.count} Feeds</Heading>
      <Stack spacing={1}>
        {props.feeds.filter(feed => feed.domain.length > 0).map(feed => (
          <Box p={5} shadow="md" flex={1} borderRadius="md">
            <Heading fontSize="xl">[{feed.date}][{feed.domain}]</Heading>
            <Text mt={2} key={feed.id}>
              <Link href={feed.url}>{feed.title}</Link>
            </Text>
          </Box>))}
      </Stack>
    </Container>
  </main>
)

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient()
  const count = await prisma.feed.count()
  const feeds = await prisma.feed.findMany({ take: 300, orderBy: { domain: 'asc' } })
  const props = { count, feeds }

  return { props }
}

export default IndexPage
