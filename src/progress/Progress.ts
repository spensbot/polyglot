import { StoryIdSchema } from "@/story/Story";
import { unlerp } from "@/util/math";
import { WordSchema } from "@/dictionary/Word";
import z from "zod";

export const WordStatsSchema = z.object({
  nSeen: z.number().default(0),
  nHints: z.number().default(0),
  lastHintStory: StoryIdSchema.optional()
})
export type WordStats = z.infer<typeof WordStatsSchema>;

export const ProgressSchema = z.object({
  currentStoryId: StoryIdSchema,
  wordsSeen: z.record(WordSchema, WordStatsSchema)
})
export type Progress = z.infer<typeof ProgressSchema>;

// Alternatives: Proficiency, Aptitude
export const LEVELS = ["Beginner", "Emerging", "Intermediate", "Advanced", "Expert"] as const;
export type Level = typeof LEVELS[number];

export const WordsToExceed: Record<Level, number> = {
  Beginner: 100,
  Emerging: 300,
  Intermediate: 750,
  Advanced: 2000,
  Expert: 4000,
}
function wordsToExceed(level?: Level): number {
  return level ? WordsToExceed[level] : 0;
}

export interface LevelInfo {
  level: Level;
  nKnownWords: number;
  progressToNext: number;
}

export function knownWords(progress: Progress): number {
  const allWords = Object.values(progress.wordsSeen);
  const nWordsSeen = allWords.length;
  const nWordsStruggling = allWords.filter(w => {
    const lookedUpRecently = w.lastHintStory === progress.currentStoryId;
    return lookedUpRecently;
  }).length;
  return nWordsSeen - nWordsStruggling;
}

export function computeLevel(nKnownWords: number): LevelInfo {
  // Find the highest level for which nKnownWords >= KnownWordsByLevel[level]
  let i = 0;
  for (const level of LEVELS) {
    if (nKnownWords >= WordsToExceed[level]) {
      i += 1;
    }
  }

  const level = LEVELS[i];
  const lastLevel: Level | undefined = LEVELS[i - 1];
  const progressToNext = unlerp({ start: wordsToExceed(lastLevel), end: wordsToExceed(level) }, nKnownWords)

  return {
    level,
    nKnownWords,
    progressToNext
  };
}