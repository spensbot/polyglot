import { StoryId } from "@/story/Story";
import { Word } from "@/wordData/Word";

interface Progress {
  currentStoryId: StoryId;
  wordsSeen: Record<Word, WordStats>
}

interface WordStats {
  nSeen: number;
  nHints: number;
  lastHintStory?: StoryId;
}

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

export function getLevel(progress: Progress): Level {
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