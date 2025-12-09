import { dict } from "@/dictionary/Dictionary"
import { cn } from "@/lib/utils"
import { Word } from "@/dictionary/Word"
import { rarityInfo, getRarity } from "@/dictionary/WordRarity"
import {
  ListenButton,
  PronounceButton,
} from "@/dictionary/speech/speechButtons"
import { useAppDispatch, useAppState } from "@/state/hooks"
import { Button } from "@/components/ui/button"
import { setTranslatedSentenceIdx } from "@/state/appSlice"

interface Props {
  word: Word
  sentenceIdx?: number
  depth?: number
}

export function HintView({ word, sentenceIdx, depth = 2 }: Props) {
  const definition = dict.define(word)
  const pinyin = dict.pinyin(word)
  const frequencyRanking = dict.frequncyRanking(word)
  const language = useAppState((s) => s.language.learning)
  const dispatch = useAppDispatch()

  const chars = word.split("")

  return (
    <div
      className={cn(
        "rounded bg-neutral-800 text-white p-2 max-w-90 relative border flex flex-col",
        // "drop-shadow-[0_0_12px_rgba(14,165,233,1)]",
        "drop-shadow-[0_0_12px_rgba(0,0,0,1)]"
      )}
      onClick={(e) => e.preventDefault()}
    >
      {pinyin && (
        <div className="flex items-center gap-2">
          <p>{pinyin}</p>
          {frequencyRanking && (
            <RarityView frequencyRanking={frequencyRanking} />
          )}
          <div className="grow" />
          <PronounceButton word={word} language={language} />
          <ListenButton word={word} language={language} />
        </div>
      )}
      {depth > 1 && (
        <>
          {definition && (
            <p className="text-sm font-extralight">{definition}</p>
          )}
          {chars.length > 1 && (
            <>
              <div className="bg-white/20 w-full h-px my-2" />
              <div className="text-sm flex flex-col gap-1">
                {chars.map((char, i) => (
                  <CharView key={char + i} char={char} />
                ))}
              </div>
            </>
          )}
          {sentenceIdx !== undefined && (
            <Button
              label="Translate Sentence"
              size="sm"
              variant="outline"
              className="self-stretch"
              onClick={() => {
                dispatch(setTranslatedSentenceIdx(sentenceIdx))
              }}
            />
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
      <div className="flex gap-2 items-center">
        <span className="text-lg">{char}</span>
      </div>
      {definition && <span className="opacity-90 font-thin">{definition}</span>}
    </div>
  )
}

function RarityView({ frequencyRanking }: { frequencyRanking: number }) {
  const rarity = getRarity(frequencyRanking)
  const className = rarityInfo(rarity).className

  return (
    <p>
      <span className={cn("text-xs", className)}>{rarity}</span>
    </p>
  )
}
