import { Word } from "@/dictionary/Word"

export const PREFERRED_WORDS_LIMIT = 100;

/** Prints the preferred words list for an LLM */
export function printPreferredWords(words: Word[]): string {
  const n = words.length
  return words.map((w, i) => `${i + 1}. ${w}${i === 0 ? " (highest priority)" : ""}${i === n - 1 ? " (lowest priority)" : ""}`)
    .join("\n")
}

export const getBiasCompareCb = (llmBias: Record<Word, number>) => (a: Word, b: Word): number => {
  const biasA = llmBias[a] ?? 0.0
  const biasB = llmBias[b] ?? 0.0
  return biasB - biasA
}