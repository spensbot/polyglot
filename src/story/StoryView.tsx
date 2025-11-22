import { ParsedWord } from "./Story"
import { WordView } from "./WordView"
import { parseStory } from "./parseStory"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/hooks"

interface Props {
  className?: string
}

export function StoryView({ className }: Props) {
  const storyId = useAppState((state) => state.currentStory.storyId)
  const story = useAppState((state) => state.storiesById[storyId])

  if (!story) return null

  if (story.status === "loading" || story.status === "idle") {
    return <div className={cn(className, "italic")}>Loading story...</div>
  }

  if (story.status === "error") {
    return <div className={cn(className)}>Error Loading Story: {story.err}</div>
  }

  const { parsedTitle, parsedContent } = story.val

  return (
    <div className={cn(className, "select-none flex flex-col gap-1")}>
      <StoryLine line={parsedTitle} className={"mb-8 text-3xl"} />
      {parsedContent.map((line, index) => (
        <StoryLine key={index} line={line} />
      ))}
    </div>
  )
}

function StoryLine({
  line,
  className,
}: {
  line: ParsedWord[]
  className?: string
}) {
  return (
    <div className={cn("text-xl flex flex-wrap mb-4", className)}>
      {line.map((word) => (
        <WordView key={word.parsedId} word={word} />
      ))}
    </div>
  )
}
