import { ChevronRight } from "lucide-react"
import { WordProgress } from "./Progress"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { dict } from "@/dictionary/Dictionary"
import { WordProgressView } from "./WordProgressView"
import { getInfo, getRarity, WordRarity } from "@/dictionary/WordRarity"
import { getOrCreate } from "@/util/collectionUtil"

export function WordProgressGroup({
  label,
  description,
  words,
  selected,
  setSelected,
  collapsedOnRender,
}: {
  label: string
  description?: string
  words: WordProgress[]
  selected: WordProgress | null
  setSelected: (word: WordProgress | null) => void
  collapsedOnRender?: boolean
}) {
  const [collapsed, setCollapsed] = useState(collapsedOnRender ?? false)

  const wordsByRarity = getWordsByRarity(words)

  return (
    <div>
      <div
        className="text-xl mb-2 flex items-baseline gap-2 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <DropdownIndicator collapsed={collapsed} />
        {label}
        <span className="text-sm opacity-50">({words.length})</span>
        <span className="text-sm opacity-50">{description}</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          {Array.from(wordsByRarity.entries()).map(([rarity, words]) => {
            return (
              <WordFrequencyGroup
                rarity={rarity}
                words={words}
                selected={selected}
                setSelected={setSelected}
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
}: {
  rarity: WordRarity
  words: WordProgress[]
  selected: WordProgress | null
  setSelected: (word: WordProgress | null) => void
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex flex-col gap-2 pl-6">
      <div
        className={cn(
          "flex items-center w-full gap-2",
          getInfo(rarity).className
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {/* <DropdownIndicator collapsed={collapsed} /> */}
        <h4 className="text-lg">{rarity}</h4>
        <p>{}</p>
        <div
          className="h-px bg-white grow"
          style={{ backgroundColor: getInfo(rarity).color }}
        />
      </div>
      {!collapsed && (
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {words.map((w) => (
            <WordProgressView
              key={w.word}
              word={w}
              selected={selected?.word === w.word}
              setSelected={setSelected}
              className={cn("p-1 -m-1 text-xl text-white/80")}
            />
          ))}
        </div>
      )}
      {/* <div
        className="h-px bg-white grow"
        style={{ backgroundColor: getInfo(rarity).color }}
      /> */}
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
