import { useEffect, useState } from "react"
import { TranslatedSection, TranslatedSectionSchema } from "./TranslatedSection"
import { Async, AsyncState } from "@/util/AsyncState"
import { LanguageSettings } from "@/app/LanguageSettings"
import { generateObj } from "@/util/llm/generate"
import { createOpenAI } from "@ai-sdk/openai"
import { translateSectionPrompt } from "./translateSectionPrompt"
import {
  Secrets,
  setTranslatedSentenceIdx,
  setTranslation,
} from "@/state/appSlice"
import { Log } from "@/util/Log"
import { dict } from "../Dictionary"
import { Word } from "../Word"
import { Modal } from "@/components/Modal"
import { useAppDispatch, useCurrentStory } from "@/state/hooks"
import { Button } from "@/components/ui/button"
import { translateSectionThunk } from "./translateSectionThunk"

export function TranslatedSentenceModal({
  sentenceIdx,
}: {
  sentenceIdx: number
}) {
  const dispatch = useAppDispatch()

  const translation = useCurrentStory((s) => {
    if (s.status === "success") {
      return s.val.translationBySentenceIdx[sentenceIdx]
    }
  })

  if (translation === undefined || translation.status === "idle") {
    dispatch(translateSectionThunk(sentenceIdx))
  }

  return (
    <Modal onClick={() => dispatch(setTranslatedSentenceIdx(undefined))}>
      <TranslatedSectionAsyncView
        asyncTranslation={translation ?? Async.idle()}
      />
    </Modal>
  )
}

function TranslatedSectionAsyncView({
  asyncTranslation,
}: {
  asyncTranslation: AsyncState<TranslatedSection>
}) {
  if (asyncTranslation.status === "loading") {
    return <p>Loading translation...</p>
  } else if (asyncTranslation.status === "error") {
    return (
      <p>
        Error loading translation: {asyncTranslation.err}
        <CloseButton />
      </p>
    )
  } else if (asyncTranslation.status === "success") {
    const translation = asyncTranslation.val
    return (
      <div className="flex flex-col gap-4">
        <p>{translation.naturalTranslation}</p>
        <div className="flex flex-wrap gap-y-2 -mx-2 items-start">
          {translation.segments.map((lt) => {
            return (
              <div
                className="flex flex-col min-w-10 max-w-30 items-center border-r last:border-0 px-2 my-2"
                key={lt.segment}
              >
                <span className="text-xl opacity-60">{lt.segment}</span>
                {/* <span className="opacity-50">
                  {dict.pinyin(lt.segment as Word)}
                </span> */}
                <span className="text-center text-sm">{lt.gloss}</span>
              </div>
            )
          })}
        </div>
        <CloseButton />
      </div>
    )
  } else {
    return null
  }
}

function CloseButton() {
  const dispatch = useAppDispatch()
  return (
    <Button
      label="Close"
      onClick={() => dispatch(setTranslatedSentenceIdx(undefined))}
    />
  )
}

/** Component that allows for ephemeral translation.
 * I no longer use this, because it's nice to pull a translation back up for a given sentence.
 */
function TranslatedSectionView({
  section,
  languageSettings,
  secrets,
}: {
  section: string
  languageSettings: LanguageSettings
  secrets: Secrets
}) {
  const [translation, setTranslation] = useState<AsyncState<TranslatedSection>>(
    Async.idle()
  )
  useEffect(() => {
    setTranslation(Async.loading())
    generateObj<TranslatedSection>(
      {
        model: createOpenAI({
          apiKey: secrets.openai.apiKey,
          organization: secrets.openai.orgId,
        })("gpt-4.1-nano"),
        temperature: 0.2,
        prompt: translateSectionPrompt(section, languageSettings),
      },
      TranslatedSectionSchema
    ).then((result) => {
      setTranslation(Async.fromResult(result))
    })
  }, [section, languageSettings])

  return <TranslatedSectionAsyncView asyncTranslation={translation} />
}
