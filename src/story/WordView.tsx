import { Popover } from "radix-ui"
import { useRef } from "react"
import { useAppState, useDispatch } from "@/state/hooks"
import { hint } from "@/state/appSlice"
import { ParsedWord } from "./ParsedStory"
import { HintView } from "./HintView"
import { wrapClick } from "@/util/wrapClick"

export function WordView({ word }: { word: ParsedWord }) {
  const currentHint = useAppState((state) => state.hint)
  const isActive = currentHint?.word.parsedId === word.parsedId
  const hintLevel = isActive ? currentHint.level : 0
  const dispatch = useDispatch()
  const anchorRef = useRef<HTMLSpanElement | null>(null)

  return (
    <Popover.Root
      open={isActive}
      // onOpenChange
    >
      <Popover.Anchor asChild>
        <span
          ref={anchorRef}
          onClick={wrapClick((e) => {
            e.preventDefault()
            dispatch(
              hint({
                word,
                level: isActive ? hintLevel + 1 : 1,
              })
            )
          })}
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
