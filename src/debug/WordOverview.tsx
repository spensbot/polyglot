import { cn } from "@/lib/utils"
import { getPreferredWordsV3 } from "@/progress/preferredWordsV3"
import { useAppState, useCurrentStory } from "@/state/hooks"

export function WordOverview({ className }: { className?: string }) {
  const app = useAppState((s) => s)
  const story = useCurrentStory((s) => s)
  const preferred = getPreferredWordsV3(app)

  if (story.status !== "success") return "Word Overview: Story Not Loaded"

  const storySet = new Set(story.val.parsedAll.map((w) => w.word))

  const nStory = story.val.parsedAll.length
  const nStoryUnique = storySet.size
  const nPreferred = preferred.length
  const nPreferredInStory = preferred.filter((w) => storySet.has(w)).length
  const preferredPct = ((nPreferredInStory / nStoryUnique) * 100).toFixed(0)

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h3>Word Overview</h3>
      <div className="text-neutral-400">
        <p>
          <span className="text-white">In Story:</span> {nStory}{" "}
          {`(${nStoryUnique} unique, ${preferredPct}% preferred)`}
        </p>
        <p>
          <span className="text-white">Preferred:</span> {nPreferred}{" "}
          {`(${nPreferredInStory} in story)`}
        </p>
      </div>
    </div>
  )
}
