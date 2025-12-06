import {
  StackedBarChart,
  StackedBarChartLegend,
  StackedBarEntry,
} from "@/components/StackedBarChart"
import { Word } from "@/dictionary/Word"
import {
  preferredWordsByBucket,
  targetBucketWeights,
} from "@/progress/preferredWordsByBucket"
import {
  buckets,
  isKnown,
  isLearning,
  learningToSeenRatio,
  Progress,
} from "@/progress/Progress"
import { useAppState, useCurrentStory } from "@/state/hooks"

export function WordBucketStats() {
  const app = useAppState((s) => s)
  const progressBuckets = buckets(app.progress)
  const story = useCurrentStory((s) => s)
  const ltsRatio = useAppState((s) => learningToSeenRatio(s.progress))
  const targetWeights = targetBucketWeights(ltsRatio)

  const colorByBucket: Record<string, string> = {
    learning: "#f59e0b",
    known: "#10b981",
    familiar: "#3b82f6",
    unseen: "#6b7280",
  }

  const progressEntries: StackedBarEntry[] = Object.entries(
    progressBuckets
  ).map(([key, words]) => ({
    label: key,
    color: colorByBucket[key],
    weight: words.length,
  }))

  const targetEntries: StackedBarEntry[] = Object.entries(targetWeights).map(
    ([key, weight]) => ({
      label: key,
      color: colorByBucket[key],
      weight,
    })
  )

  const preferredWords = preferredWordsByBucket(app)
  const preferredBuckets = wordBuckets(preferredWords, app.progress)
  const preferredEntries: StackedBarEntry[] = Object.entries(
    preferredBuckets
  ).map(([key, count]) => ({
    label: key,
    color: colorByBucket[key],
    weight: count,
  }))

  const storyWords = story.status === "success" ? story.val.parsedAll : []
  const storyBuckets = wordBuckets(
    storyWords.map((w) => w.word),
    app.progress
  )
  const storyEntries: StackedBarEntry[] = Object.entries(storyBuckets).map(
    ([key, count]) => ({
      label: key,
      color: colorByBucket[key],
      weight: count,
    })
  )

  const nUnique = new Set(storyWords.map((w) => w.word)).size
  const nPreferredInStory = storyWords.filter((w) =>
    preferredWords.includes(w.word)
  ).length

  return (
    <div className="flex flex-col gap-2">
      <h3 className="-mb-2">Words By User Bucket</h3>
      <StackedBarChart title="Progress" entries={progressEntries} />
      <StackedBarChart title="Target (based on LTS)" entries={targetEntries} />
      <StackedBarChart
        title={`Preferred (${preferredWords.length}) In Story (${nPreferredInStory})`}
        entries={preferredEntries}
      />
      <StackedBarChart
        title={`In Story (${storyWords.length}) (${nUnique} unique)`}
        entries={storyEntries}
      />

      <StackedBarChartLegend entries={storyEntries} />
    </div>
  )
}

function wordBuckets(words: Word[], progress: Progress) {
  const buckets = {
    learning: 0,
    known: 0,
    familiar: 0,
    unseen: 0,
  }

  words.forEach((w) => {
    const wp = progress.wordsSeen[w]
    if (wp === undefined) return buckets.unseen++
    if (isKnown(wp)) return buckets.known++
    if (isLearning(wp)) return buckets.learning++
    return buckets.familiar++
  })

  return buckets
}
