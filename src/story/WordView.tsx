import { Popover } from "radix-ui"
import { useRef } from "react"
import { useAppState, useAppDispatch } from "@/state/hooks"
import { hint } from "@/state/appSlice"
import { HintView } from "./HintView"
import { wrapClick } from "@/util/wrapClick"
import { ParsedWord } from "./Story"
import { cn } from "@/lib/utils"
import { dict } from "@/dictionary/Dictionary"

export function WordView({ word }: { word: ParsedWord }) {
  const hintLevel = useAppState((state) => {
    if (state.hint && state.hint.word.parsedId === word.parsedId) {
      return state.hint.level
    } else {
      return 0
    }
  })
  const anchorRef = useRef<HTMLSpanElement | null>(null)
  const dispatch = useAppDispatch()
  const languageAlternate = useAppState((state) => state.language.alternate)
  let displayWord: string = word.word
  if (languageAlternate && dict.alternate(word.word)) {
    const alternate = dict.alternate(word.word)
    if (alternate) displayWord = alternate
  }
  const onClick = wrapClick((e) => {
    dispatch(
      hint({
        word,
      })
    )
  })

  if (hintLevel === 0) {
    return <SimpleWordView display={displayWord} onClick={onClick} />
  }

  return (
    <Popover.Root open={hintLevel > 0}>
      <Popover.Anchor asChild>
        <SimpleWordView
          display={displayWord}
          ref={anchorRef}
          onClick={onClick}
        />
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          sideOffset={5}
          collisionPadding={20}
          className="focus:outline-none z-30"
        >
          <HintView
            word={word.word}
            sentenceIdx={word.loc.sentenceIdx}
            depth={hintLevel}
          />
          <Popover.Arrow className="fill-neutral-700" width={15} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function SimpleWordView({
  display,
  ref,
  onClick,
  noPadding,
}: {
  display: string
  ref?: React.Ref<HTMLSpanElement>
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  noPadding?: boolean
}) {
  return (
    <span
      ref={ref}
      onClick={onClick}
      className={cn(
        "group py-1 rounded relative",
        noPadding ? "-px-1" : "px-1"
      )}
    >
      {display}
    </span>
  )
}
