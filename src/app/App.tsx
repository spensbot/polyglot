import { ProgressView } from "../progress/ProgressView"
import { useAppState } from "../state/hooks"
import { StoryView } from "../story/StoryView"
import cn from "classnames"
import { TitleView } from "./TitleView"

function App() {
  const progress = useAppState((state) => state.progress)

  return (
    <div
      className={cn("w-screen h-screen bg-neutral-950", "flex items-stretch")}
    >
      <div className="flex-2 min-w-0">
        <TitleView className="p-4" />
        <StoryView className="p-4" id={progress.currentStoryId} />
      </div>
      <ProgressView
        className="flex-1 min-w-0 p-4 bg-neutral-900"
        progress={progress}
      />
    </div>
  )
}

export default App
