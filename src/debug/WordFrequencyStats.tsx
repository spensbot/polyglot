import {
  StackedBarChart,
  StackedBarChartLegend,
  StackedBarEntry,
} from "@/components/StackedBarChart"
import { dict } from "@/dictionary/Dictionary"
import { Word } from "@/dictionary/Word"
import {
  rarityInfo,
  getRarity,
  WordRarity,
  WORD_RARITY_LIST,
} from "@/dictionary/WordRarity"
import { preferredWordsByBucket } from "@/progress/preferredWordsByBucket"
import { useAppState, useCurrentStory } from "@/state/hooks"
import { getOrCreate } from "@/util/collectionUtil"

export function WordFrequencyStats() {
  const app = useAppState((s) => s)
  const story = useCurrentStory((s) => s)

  if (story.status !== "success") return null

  const preferredWords = preferredWordsByBucket(app)
  const preferredBuckets = freqBuckets(preferredWords)
  const preferredEntries: StackedBarEntry[] = WORD_RARITY_LIST.map((rarity) => {
    const count = preferredBuckets.get(rarity)
    if (count === undefined) return null
    return {
      label: rarity,
      color: rarityInfo(rarity).color,
      weight: count,
    }
  }).filter((e) => e !== null)

  const storyBuckets = freqBuckets(story.val.parsedAll.map((w) => w.word))
  const storyEntries: StackedBarEntry[] = WORD_RARITY_LIST.map((rarity) => {
    const count = storyBuckets.get(rarity)
    if (count === undefined) return null
    return {
      label: rarity,
      color: rarityInfo(rarity).color,
      weight: count,
    }
  }).filter((e) => e !== null)

  const nUnique = new Set(story.val.parsedAll.map((w) => w.word)).size
  const nPreferredInStory = story.val.parsedAll.filter((w) =>
    preferredWords.includes(w.word)
  ).length

  return (
    <div className="flex flex-col gap-2">
      <h3 className="-mb-2">Words By Frequency</h3>
      <StackedBarChart
        title={`Preferred (${preferredWords.length}) In Story (${nPreferredInStory})`}
        entries={preferredEntries}
      />
      <StackedBarChart
        title={`In Story (${story.val.parsedAll.length}) (${nUnique} unique)`}
        entries={storyEntries}
      />

      <StackedBarChartLegend entries={preferredEntries} />
    </div>
  )
}

function freqBuckets(words: Word[]) {
  const rarityCounts = new Map<WordRarity, number>()

  words.forEach((w) => {
    const ranking = dict.frequncyRanking(w)
    if (!ranking) return
    const rarity = getRarity(ranking)
    rarityCounts.set(rarity, getOrCreate(rarityCounts, rarity, () => 0) + 1)
  })

  return rarityCounts
}
