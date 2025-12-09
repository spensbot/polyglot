import { setTranslation } from "@/state/appSlice";
import { AppThunk } from "@/state/store";
import { Async } from "@/util/AsyncState";
import { translateSectionPrompt } from "./translateSectionPrompt";
import { getSentenceByIdx } from "@/story/parseStory";
import { Log } from "@/util/Log";
import { generateObj } from "@/util/llm/generate";
import { TranslatedSectionSchema } from "./TranslatedSection";
import { createOpenAI } from "@ai-sdk/openai";

export const translateSectionThunk = (sentenceIdx: number): AppThunk => async (dispatch, getState) => {
  const app = getState().app

  const story = app.storiesById[app.currentStory.storyId]
  if (story.status !== 'success') {
    return Log.error(`Cannot translate section: story not loaded`)
  }

  const section = getSentenceByIdx(story.val.story, sentenceIdx)
  if (section === undefined) {
    return Log.error(`Cannot translate section: sentenceIdx ${sentenceIdx} out of bounds`)
  }

  dispatch(setTranslation({
    sentenceIdx,
    translation: Async.loading()
  }))

  const prompt = translateSectionPrompt(section, app.language)
  const secrets = app.secrets

  const translatedSection = await generateObj(
    {
      model: createOpenAI({
        apiKey: secrets.openai.apiKey,
        organization: secrets.openai.orgId,
      })("gpt-4.1-nano"),
      temperature: 0.2, // Low temperature for more deterministic output
      prompt,
    },
    TranslatedSectionSchema
  )

  dispatch(setTranslation({
    sentenceIdx,
    translation: Async.fromResult(translatedSection)
  }))
}