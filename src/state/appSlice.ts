import { Progress, ProgressSchema, WordStats } from '@/progress/Progress'
import { stories, nextStoryId } from '@/story/stories'
import { HintSchema } from '@/story/Story'
import { parseStory } from '@/story/parseStory'
import { Word, WordSchema } from '@/dictionary/Word'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import z from 'zod'
import { ParsedWord } from '@/story/ParsedStory'

export const AppStateSchema = z.object({
  progress: ProgressSchema,
  hint: HintSchema.optional()
})

export type AppState = z.infer<typeof AppStateSchema>

export const initialState: AppState = {
  progress: {
    currentStoryId: stories[0].id,
    wordsSeen: {}
  },
}

export const appSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    nextStory: (state) => {
      const story = stories.find((story) => story.id === state.progress.currentStoryId)!;

      parseStory(story).parsedAll.forEach(word => {
        const stats = getOrCreateWordStats(state.progress.wordsSeen, word.word)
        stats.nSeen += 1
      })

      state.progress.currentStoryId = nextStoryId(state.progress.currentStoryId)
    },
    hint: (state, action: PayloadAction<{ word: ParsedWord, level: number }>) => {
      const hint = action.payload

      state.hint = action.payload
      getOrCreateWordStats(state.progress.wordsSeen, hint.word.word).nHints += 1
    },
    clearHint: (state) => {
      state.hint = undefined
    }
  },
})

function getOrCreateWordStats(wordsSeen: Record<Word, WordStats>, word: Word): WordStats {
  if (!wordsSeen[word]) {
    wordsSeen[word] = {
      nSeen: 0,
      nHints: 0,
      lastHintStory: undefined
    }
  }
  return wordsSeen[word]
}

// Action creators are generated for each case reducer function
export const {
  nextStory,
  hint,
  clearHint
} = appSlice.actions

export default appSlice.reducer