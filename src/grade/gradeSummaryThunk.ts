import { setGrade } from "@/state/appSlice"
import { Story } from "@/story/Story"
import { AsyncState } from "@/util/AsyncState"
import { gradeSummary } from "./gradeSummary"
import { AppDispatch } from "@/state/store"

export async function gradeSummaryThunk(dispatch: AppDispatch, story: AsyncState<Story>, summary: string) {
  if (story.status !== "success") return
  dispatch(setGrade({ status: "loading" }))
  const grade = await gradeSummary({
    story: story.val,
    summary,
  })
  if (grade.ok) {
    dispatch(setGrade({ status: "success", val: grade.val }))
  } else {
    dispatch(setGrade({ status: "error", err: grade.err }))
  }
}