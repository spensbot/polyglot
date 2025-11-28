import { useDispatch } from "react-redux"
import { dict } from "@/dictionary/Dictionary"
import { useAppState } from "@/state/hooks"
import { cn } from "@/lib/utils"
import { Word } from "@/dictionary/Word"
import { ParsedWord } from "./Story"
import { getClassName, getRarity } from "@/dictionary/WordRarity"

export function HintView({ word }: { word: ParsedWord }) {
  const definition = dict.define(word.word)
  const pinyin = dict.pinyin(word.word)
  const frequencyRanking = dict.frequncyRanking(word.word)

  const hintLevel = useAppState((state) =>
    state.hint?.word?.parsedId === word.parsedId ? state.hint.level : 0
  )

  const dispatch = useDispatch()

  // const frequency = Hanzi.getFrequency(word)
  // if (!frequency) return null
  // const { ranking, definition } = frequency

  const chars = word.word.split("")

  return (
    <div
      className={cn(
        "rounded bg-neutral-800 text-white p-2 max-w-90 relative border",
        // "drop-shadow-[0_0_12px_rgba(14,165,233,1)]",
        "drop-shadow-[0_0_12px_rgba(0,0,0,1)]"
      )}
    >
      {pinyin && (
        <div className="flex items-baseline gap-2">
          <p>{pinyin}</p>
          {frequencyRanking && (
            <RarityView frequencyRanking={frequencyRanking} />
          )}
        </div>
      )}
      {hintLevel > 1 && (
        <>
          {definition && (
            <p className="text-sm font-extralight">{definition}</p>
          )}
          {chars.length > 1 && (
            <>
              <div className="bg-white/20 w-full h-px my-2" />
              <div className="text-sm flex flex-col gap-1">
                {chars.map((char) => (
                  <CharView key={char} char={char} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

function CharView({ char }: { char: string }) {
  const definition = dict.define(char as Word)

  return (
    <div className="flex gap-2 items-start">
      <span className="text-lg">{char}</span>
      {definition && <span className="opacity-90 font-thin">{definition}</span>}
    </div>
  )
}

function RarityView({ frequencyRanking }: { frequencyRanking: number }) {
  const rarity = getRarity(frequencyRanking)
  const className = getClassName(rarity)

  return (
    <p>
      <span className={cn("text-xs", className)}>{rarity}</span>
      {/* <span className="text-xs opacity-50">({frequencyRanking})</span> */}
    </p>
  )
}
