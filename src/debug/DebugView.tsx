import { cn } from "@/lib/utils"
import { learningToSeenRatio } from "@/progress/Progress"
import { useAppState, useCurrentStory } from "@/state/hooks"
import { WordBucketStats } from "./WordBucketStats"
import { WordFrequencyStats } from "./WordFrequencyStats"
import { preferredWordsByBucket } from "@/progress/preferredWordsByBucket"

export function DebugView() {
  const ltsRatio = useAppState((s) => learningToSeenRatio(s.progress))
  const app = useAppState((s) => s)

  const preferredWords = preferredWordsByBucket(app)
  const storyWords = useCurrentStory((s) =>
    s.status === "success" ? s.val.parsedAll.map((w) => w.word) : []
  )
  const nStory = storyWords.length
  const nUnique = new Set(storyWords).size

  const nPreferredInStory = storyWords.filter((w) =>
    preferredWords.includes(w)
  ).length

  return (
    <div
      className={cn("w-full h-full overflow-scroll", "flex flex-col gap-4 p-4")}
    >
      <h2 className="text-2xl">Debug View</h2>
      <Item text="Learning to Seen Ratio:" value={ltsRatio.toFixed(2)} />
      <WordBucketStats />
      <WordFrequencyStats />
      <h3 className="-mb-2">
        Story Words{" "}
        <span className="text-sm opacity-50">
          ({nStory} total / {nUnique} unique)
        </span>
      </h3>
      <h3 className="-mb-2">
        Preferred{" "}
        <span className="text-sm opacity-50">
          ({preferredWords.length}) In Story ({nPreferredInStory})
        </span>
      </h3>
      <p className="opacity-50">{preferredWords.join(", ")}</p>
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
