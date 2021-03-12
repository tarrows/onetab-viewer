import React from 'react'
import type { Story } from "@prisma/client"
import { Card, Heading, majorScale, Pill, Text } from 'evergreen-ui'
import { fromUnixTime } from 'date-fns'
import styles from './StoryCard.module.css'

const datetime = new Intl.DateTimeFormat('ja-JP')

export type Props = {
  story: Story
}

export const StoryCard: React.FC<Props> = (props) => (
  <Card
    padding={majorScale(1)}
    maxWidth={800}
    border="muted">
    <div className={styles.cardHeader}>
      <Heading>{props.story.title}</Heading>
      <div className={styles.grow}></div>
      <Pill display="inline-flex" margin={8} color="red" isSolid>
        {props.story.score}
      </Pill>
    </div>
    <div>
      <Text marginRight={majorScale(1)}>
        {datetime.format(fromUnixTime(props.story.time))}
      </Text>
      <Text>by {props.story.by}</Text>
    </div>
  </Card>
)
