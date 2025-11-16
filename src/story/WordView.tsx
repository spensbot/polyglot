import { cn } from "@/lib/utils"
import { useAsync } from "@/util/hooks/useAsync"
import { prettyPinyin } from "@/wordData/chinese/prettyPinyin"
import { Hanzi } from "@/wordData/Hanzi"
import { Word } from "@/wordData/Word"
import { Popover } from "radix-ui"
import { ParsedWord } from "./storyUtil"
import { useAppState, useDispatch } from "@/state/hooks"
import { hint, clearHint } from "@/state/appSlice"
import { Button } from "@/components/ui/button"

export function WordView({ word }: { word: ParsedWord }) {
  const hintLevel = useAppState((state) =>
    state.hint?.word?.parsedId === word.parsedId ? state.hint.level : 0
  )
  const dispatch = useDispatch()

  return (
    <Popover.Root
      open={hintLevel > 0}
      onOpenChange={(open) => {
        // when popover is closed (click-away), clear the hint state
        if (!open) dispatch(clearHint())
      }}
    >
      <Popover.Anchor asChild>
        <span
          onClick={() =>
            dispatch(
              hint({
                word,
                level: 1,
              })
            )
          }
          className="group bg-neutral-900 text-white p-1 m-1 rounded relative"
        >
          {word.word}
        </span>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content sideOffset={5} collisionPadding={20}>
          <HintView word={word} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function HintView({ word }: { word: ParsedWord }) {
  const entry = useAsync(() => Hanzi.definitionLookup(word.word), [word])
  const dispatch = useDispatch()

  const hintLevel = useAppState((state) =>
    state.hint?.word?.parsedId === word.parsedId ? state.hint.level : 0
  )

  // const frequency = Hanzi.getFrequency(word)
  // if (!frequency) return null
  // const { ranking, definition } = frequency

  const chars = word.word.split("")

  return (
    <div
      className={cn(
        "rounded shadow-lg bg-blue-400 text-black p-2 min-w-80 text-sm relative"
      )}
    >
      {entry.status === "success" && entry.data && (
        <p>{entry.data.pinyin.map(prettyPinyin).join(", ")}</p>
      )}
      {hintLevel > 1 && (
        <>
          {entry.status === "success" && entry.data && (
            <p>{entry.data.definitions.join(", ")}</p>
          )}
        </>
      )}
      {hintLevel > 2 && (
        <div className="">
          {chars.map((char) => (
            <p key={char}>{`${char} ${char}`}</p>
          ))}
        </div>
      )}
      <Button
        size="sm"
        onClick={() => dispatch(hint({ word, level: hintLevel + 1 }))}
      >
        More
      </Button>
      <button
        className="absolute top-1 right-1 w-5 h-5"
        onClick={() => dispatch(clearHint())}
      >
        X
      </button>
    </div>
  )
}
