import { TranslatedSentenceModal } from "@/dictionary/translation/TranslatedSentenceModal"
import { GradeView } from "@/grade/GradeView"
import { SummaryInput } from "@/grade/SummaryInput"
import { cn } from "@/lib/utils"
import { clearHint } from "@/state/appSlice"
import { useAppState } from "@/state/hooks"
import { StoryView } from "@/story/StoryView"
import { wrapClick } from "@/util/wrapClick"
import { useDispatch } from "react-redux"

export function Home() {
  const translatedSentenceIdx = useAppState((s) => s.translatedSentenceIdx)
  const dispatch = useDispatch()
  return (
    <div
      className={cn("w-full h-full relative", "flex items-stretch")}
      onClick={wrapClick((e) => {
        dispatch(clearHint())
      })}
    >
      <div className="flex-2 min-w-0 border-r flex justify-center">
        {/* <TitleView className="p-4" /> */}
        <div className="w-3xl h-full min-h-0 flex flex-col">
          <StoryView className="w-full p-4 pb-8 min-h-0 overflow-scroll flex-1" />
          <div className="z-10 p-4 pt-0 -mt-6 w-full">
            <SummaryInput className="bg-neutral-800/60 border backdrop-blur-sm" />
          </div>
        </div>
      </div>
      {/* <div className="flex-1 flex flex-col p-4 bg-neutral-800 max-md:hidden">
        <ProgressOverview className="min-w-0" />
      </div> */}
      <GradeView className="absolute inset-0 bg-black/50 z-40" />
      {translatedSentenceIdx !== undefined && (
        <TranslatedSentenceModal sentenceIdx={translatedSentenceIdx} />
      )}
    </div>
  )
}
