import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { useAppState, useDispatch } from "@/state/hooks"
import { Grade, GradeLetter, isPassingGrade } from "./Grade"
import { Button } from "@/components/ui/button"
import { CircleArrowRight, RotateCcw } from "lucide-react"
import { nextStory, retryStory, setGrade, setStory } from "@/state/appSlice"
import { generateStoryId } from "@/story/Story"
import { createStory } from "@/story/createStory"
import { Async } from "@/util/AsyncState"
import { createStoryThunk } from "@/story/createStoryThunk"
import { Log } from "@/util/Log"

export function GradeView() {
  const grade = useAppState((s) => s.currentStory.grade)

  if (!grade) return null

  return (
    <div
      className={cn(
        "absolute inset-0 bg-black/50",
        "flex flex-col items-center justify-center"
      )}
    >
      <div className="m-10 p-12 max-w-[700px] bg-neutral-800 rounded-xl shadow-2xl">
        {(grade.status === "loading" || grade.status === "idle") && (
          <GradeLoadingView />
        )}
        {grade.status === "error" && <p>Error grading summary: {grade.err}</p>}
        {grade.status === "success" && <GradeSuccessView grade={grade.val} />}
      </div>
    </div>
  )
}

function GradeLoadingView() {
  return (
    <div className="flex items-center gap-2">
      <Spinner className="w-6 h-6" />
      Grading
    </div>
  )
}

function GradeSuccessView({ grade }: { grade: Grade }) {
  const isPass = isPassingGrade(grade)
  const color = gradeToColor(grade)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-2">
        <p className="text-4xl" style={{ color }}>
          {grade.letter} -
        </p>
        <p className="text-4xl" style={{ color }}>
          {isPass ? "Pass" : "Fail"}
        </p>
      </div>

      <p>{grade.reason}</p>

      <ContinueButton grade={grade} />
    </div>
  )
}

function gradeToColor(grade: Grade): string {
  const colorByGrade: Record<GradeLetter, string> = {
    A: "green",
    B: "lime",
    C: "yellow",
    D: "orange",
    F: "red",
  }
  return colorByGrade[grade.letter]
}

function ContinueButton({ grade }: { grade: Grade }) {
  const dispatch = useDispatch()
  const progress = useAppState((s) => s.progress)

  const isPass = isPassingGrade(grade)

  if (!isPass) {
    return (
      <Button
        className="flex items-center gap-2"
        onClick={() => {
          dispatch(retryStory())
        }}
      >
        <RotateCcw />
        Re-read Story
      </Button>
    )
  }

  return (
    <Button
      className="flex items-center gap-2"
      onClick={() => {
        Log.temp("Continuing to next story")
        createStoryThunk(dispatch, progress)
      }}
    >
      <CircleArrowRight />
      Continue
    </Button>
  )
}
