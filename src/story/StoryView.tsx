import { stories } from "./stories"
import { StoryId } from "./Story"
import { WordView } from "./WordView"
import { parseStory } from "./parseStory"
import { cn } from "@/lib/utils"
import { ParsedWord } from "./ParsedStory"

interface Props {
  className?: string
  id: StoryId
}

export function StoryView({ className, id }: Props) {
  const story = stories.find((s) => s.id === id)

  if (!story) return null

  const { parsedTitle, parsedContent } = parseStory(story)

  return (
    <div className={cn(className, "select-none")}>
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
    <div className={cn("h-8 text-xl", className)}>
      {line.map((word) => (
        <WordView key={word.parsedId} word={word} />
      ))}
    </div>
  )
}
