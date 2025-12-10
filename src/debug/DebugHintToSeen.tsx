import { Button } from "@/components/ui/button"
import { DebugItem } from "./DebugItem"
import {
  hintToSeenRatio_recent,
  RECENT_STORIES_THRESHOLD,
} from "@/progress/hintToSeenRatio"
import { useAppDispatch, useAppState } from "@/state/hooks"
import { DEBUG_hintAll } from "@/state/appSlice"
import { getMostRecentParsedStories } from "@/state/util"
import { cn } from "@/lib/utils"

export function DebugHintToSeen({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const hsRatio = useAppState((s) => hintToSeenRatio_recent(s))

  const recentlySeen = useAppState((s) => {
    const recentStories = getMostRecentParsedStories(
      s,
      RECENT_STORIES_THRESHOLD
    )
    const recentlySeenWords = new Set(
      recentStories.flatMap((story) => story.parsedAll.map((p) => p.word))
    )
    return recentlySeenWords
  })

  const recentlyHinted = useAppState((app) => {
    return Object.entries(app.progress.wordsSeen)
      .filter(([_, wp]) => {
        if (wp.nStoriesSinceLastHint === undefined) return false
        return wp.nStoriesSinceLastHint <= RECENT_STORIES_THRESHOLD
      })
      .map(([word, wp]) => wp)
  })

  return (
    <div className={cn(className, "flex flex-col gap-2")}>
      <div className="flex justify-between items-center">
        <DebugItem
          text={`Hint / Seen Ratio (last ${RECENT_STORIES_THRESHOLD} stories):`}
          value={hsRatio.toFixed(2)}
        />
        <Button
          label="Hint All"
          variant="debug"
          onClick={() => dispatch(DEBUG_hintAll())}
        />
      </div>
      <p className="text-sm opacity-50">
        {`Recently Seen (${recentlySeen.size}): (${Array.from(
          recentlySeen.values()
        )
          .sort()
          .join(", ")})`}
      </p>
      <p className="text-sm opacity-50">
        {`Recently Hinted (${recentlyHinted.length}): (${recentlyHinted
          .map((wp) => wp.word)
          .sort()
          .join(", ")})`}
      </p>
    </div>
  )
}
