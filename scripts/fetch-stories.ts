import { promises as fs } from 'fs'
import got from 'got'

const ENDPOINT = "https://hacker-news.firebaseio.com/v0"
const TOP_STORIES = `${ENDPOINT}/topstories.json`

const main = async () => {
  try {
    const topstories = await got(TOP_STORIES).json() as number[]
    console.log(topstories.slice(0, 20))
    const items = await Promise.all(
      topstories
        .slice(0, 20)
        .map(id => `${ENDPOINT}/item/${id}.json`)
        .map(url => got(url))
        .map(res => res.json())
    )

    // TODO: add type
    items.map((story: any) => fs.writeFile(
      `./data/${story.id}.json`, JSON.stringify(story))
    )
  } catch (err) {
    console.error(err)
  }
}

main()
