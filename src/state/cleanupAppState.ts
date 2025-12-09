import { StoryId } from "@/story/Story"
import { AppState } from "./appSlice"
import { Streamed } from "@/util/StreamedState"

export function cleanupAppState(state: AppState): AppState {
  if (state.currentStory.grade?.status !== 'success') {
    delete state.currentStory.grade
  }
  for (const storyId in state.storiesById) {
    const id = storyId as StoryId
    const story = state.storiesById[id]
    if (story?.status !== 'success') {
      state.storiesById[id] = Streamed.idle()
    } else {
      for (const sentenceIdx in story.val.translationBySentenceIdx) {
        const translation = story.val.translationBySentenceIdx[Number(sentenceIdx)]
        if (translation.status !== 'success') {
          delete story.val.translationBySentenceIdx[Number(sentenceIdx)]
        }
      }
    }
  }
  for (const pastStory of state.pastStories) {
    if (pastStory.grade?.status !== 'success') {
      delete pastStory.grade
    }
  }
  return state
}