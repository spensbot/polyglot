import { StoryIdSchema } from "@/story/Story";
import { WordSchema } from "@/wordData/Word";
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

const LevelNames = ["Beginner", "Intermediate", "Advanced"] as const;
export type LevelName = typeof LevelNames[number];

interface Level {
  name: LevelName;
  nKnownWords: number;
  progressionInLevel: number;
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

export function computeLevel(progress: Progress): Level {
  const nKnownWords = knownWords(progress);
  if (nKnownWords < 100) {
    return {
      name: "Beginner",
      nKnownWords,
      progressionInLevel: nKnownWords / 100,
    }
  }
  if (nKnownWords < 500) {
    return {
      name: "Intermediate",
      nKnownWords,
      progressionInLevel: (nKnownWords - 100) / 400,
    }
  }
  return {
    name: "Advanced",
    nKnownWords,
    progressionInLevel: (nKnownWords - 500) / 2000,
  }
}