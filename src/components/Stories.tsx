
import React from 'react'
import type { Story } from '@prisma/client'
import { StoryCard } from './StoryCard'
import styles from './Stories.module.css'

export type Props = {
  stories: Story[]
}

export const Stories: React.FC<Props> = (props) => (
  <main className={styles.stories}>
    {props.stories.map(story => (
      <StoryCard key={story.id} story={story} />
    ))}
  </main>
)
