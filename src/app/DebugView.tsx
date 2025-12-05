import {
  StackedBarChart,
  StackedBarChartLegend,
  StackedBarEntry,
} from "@/components/StackedBarChart"
import { Word } from "@/dictionary/Word"
import { cn } from "@/lib/utils"
import { preferredWordsByBucket } from "@/progress/preferredWordsByBucket"
import {
  buckets,
  isKnown,
  isLearning,
  learningToSeenRatio,
  Progress,
  unseenWords,
} from "@/progress/Progress"
import { useAppState } from "@/state/hooks"

export function DebugView() {
  const ltsRatio = useAppState((s) => learningToSeenRatio(s.progress))

  return (
    <div
      className={cn("w-full h-full overflow-scroll", "flex flex-col gap-4 p-4")}
    >
      <h2 className="text-2xl">Debug View</h2>
      <Item text="Learning to Seen Ratio:" value={ltsRatio.toFixed(2)} />
      <WordBucketStats />
    </div>
  )
}

function Item({ text, value }: { text: string; value: string | number }) {
  return (
    <div className="flex flex-wrap gap-2">
      <p className="opacity-60">{text}</p>
      <p className="bg-black font-mono px-1 text-amber-200">{value}</p>
    </div>
  )
}

function WordBucketStats() {
  const app = useAppState((s) => s)
  const progressBuckets = buckets(app.progress)

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

  const preferredWords = preferredWordsByBucket(app)
  const preferredBuckets = wordBuckets(preferredWords, app.progress)
  const preferredEntries: StackedBarEntry[] = Object.entries(
    preferredBuckets
  ).map(([key, count]) => ({
    label: key,
    color: colorByBucket[key],
    weight: count,
  }))

  const storyData = app.storiesById[app.currentStory.storyId]
  const storyWords =
    storyData.status === "success" ? storyData.val.parsedAll : []
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

  return (
    <div className="flex flex-col gap-2">
      <StackedBarChart title="Progress" entries={progressEntries} />
      <StackedBarChart
        title={`Preferred Words (${preferredWords.length})`}
        entries={preferredEntries}
      />
      <StackedBarChart
        title={`Current Story Words (${storyWords.length})`}
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
