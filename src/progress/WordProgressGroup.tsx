import { ChevronRight } from "lucide-react"
import { WordProgress } from "./Progress"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { dict } from "@/dictionary/Dictionary"
import { WordProgressView } from "./WordProgressView"
import { rarityInfo, getRarity, WordRarity } from "@/dictionary/WordRarity"
import { getOrCreate } from "@/util/collectionUtil"

export function WordProgressGroup({
  label,
  description,
  words,
  selected,
  setSelected,
  collapsedOnRender,
  className,
}: {
  label: string
  description?: string
  words: WordProgress[]
  selected: WordProgress | null
  setSelected: (word: WordProgress | null) => void
  collapsedOnRender?: boolean
  className?: string
}) {
  const [collapsed, setCollapsed] = useState(collapsedOnRender ?? false)

  const wordsByRarity = getWordsByRarity(words)

  return (
    <div
      className={cn(
        "bg-neutral-800 p-2 -mx-2 rounded flex flex-col gap-2",
        className
      )}
    >
      <div
        className="text-xl flex items-baseline gap-2 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {/* <DropdownIndicator collapsed={collapsed} /> */}
        {label}
        <span className="text-sm opacity-50">({words.length})</span>
        <span className="text-sm opacity-50">{description}</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-2 pl-2">
          {Array.from(wordsByRarity.entries()).map(([rarity, words]) => {
            return (
              <WordFrequencyGroup
                key={rarity}
                rarity={rarity}
                words={words}
                selected={selected}
                setSelected={setSelected}
                collapsedOnRender={words.length > 15}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function WordFrequencyGroup({
  rarity,
  words,
  selected,
  setSelected,
  collapsedOnRender,
}: {
  rarity: WordRarity
  words: WordProgress[]
  selected: WordProgress | null
  setSelected: (word: WordProgress | null) => void
  collapsedOnRender?: boolean
}) {
  const [collapsed, setCollapsed] = useState(collapsedOnRender ?? false)

  return (
    <div className="flex flex-col">
      <div className={cn("flex flex-wrap gap-x-2 gap-y-1 items-center")}>
        <h4
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-lg p-1 -m-1", rarityInfo(rarity).className)}
        >
          {rarity}
        </h4>
        <span className="text-sm opacity-50">{`(${words.length})`}</span>
        {!collapsed && (
          <>
            {words.map((w) => (
              <WordProgressView
                key={w.word}
                word={w}
                selected={selected?.word === w.word}
                setSelected={setSelected}
                className={cn("p-1 -m-1 text-xl text-white/60")}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function DropdownIndicator({ collapsed }: { collapsed: boolean }) {
  return (
    <ChevronRight
      size="1rem"
      className={cn(
        "transition-transform duration-200",
        collapsed ? "" : "rotate-90"
      )}
    />
  )
}

function getWordsByRarity(
  words: WordProgress[]
): Map<WordRarity, WordProgress[]> {
  const sorted = words.sort(
    (a, b) =>
      (dict.frequncyRanking(a.word) ?? 0) - (dict.frequncyRanking(b.word) ?? 0)
  )

  const map = new Map<WordRarity, WordProgress[]>()

  for (const w of sorted) {
    const rarity = getRarity(dict.frequncyRanking(w.word) ?? 0)
    getOrCreate(map, rarity, () => []).push(w)
  }

  return map
}
