import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { setSummary } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"
import {
  DEBUG_gradeSummarySuccess,
  gradeSummaryThunk,
} from "./gradeSummaryThunk"
import { AArrowUp, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export function SummaryInput({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const { summary } = useAppState((s) => s.currentStory)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto"
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [summary])

  return (
    <div
      className={cn(
        "rounded-[24px] overflow-hidden",
        "flex items-end gap-1 p-1",
        className
      )}
    >
      <Textarea
        ref={ref}
        placeholder="Summarize The Story"
        value={summary}
        onChange={(e) => {
          dispatch(setSummary(e.target.value))
        }}
        className="border-none resize-none"
        rows={1}
      />
      <Button
        size="lg"
        onClick={() => {
          dispatch(gradeSummaryThunk())
        }}
        icon={<ArrowUp />}
        className="w-9 h-9 m-0.5 rounded-full"
        disabled={summary.trim().length === 0}
      />
      <Button
        variant="debug"
        icon={<AArrowUp />}
        onClick={() => {
          dispatch(DEBUG_gradeSummarySuccess())
        }}
        className="w-9 h-9 m-0.5 rounded-full"
      />
    </div>
  )
}
