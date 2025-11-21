import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { setSummary } from "@/state/appSlice"
import { useAppState } from "@/state/hooks"
import { useDispatch } from "react-redux"
import { gradeSummaryThunk } from "./gradeSummaryThunk"
import { createStoryThunk } from "@/story/createStoryThunk"

export function SummaryView() {
  const dispatch = useDispatch()
  const { storyId, summary } = useAppState((s) => s.currentStory)
  const story = useAppState((s) => s.storiesById[storyId])
  const progress = useAppState((s) => s.progress)

  return (
    <div>
      <Textarea
        placeholder="Summarize The Story"
        value={summary}
        onChange={(e) => dispatch(setSummary(e.target.value))}
      />
      <div className="h-2" />
      <Button
        size="lg"
        onClick={() => {
          createStoryThunk(dispatch, progress)
          // gradeSummaryThunk(dispatch, story, summary)
        }}
      >
        Grade
      </Button>
    </div>
  )
}
