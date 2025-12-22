import {
  StackedBarChart,
  StackedBarChartLegend,
  StackedBarEntry,
} from "@/components/StackedBarChart"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { colorByBucket } from "./statusBuckets"
import { getPreferredKnownRatio } from "@/progress/preferredWordsV3"
import { hintToSeenRatio_recent } from "@/progress/hintToSeenRatio"
import { useAppState } from "@/state/hooks"

export function DebugPreferredBuckets({ className }: { className?: string }) {
  const userHsRatio = useAppState((app) => hintToSeenRatio_recent(app))
  const [hsRatio, setHsRatio] = useState(userHsRatio)

  const preferredKnownRatio = getPreferredKnownRatio(hsRatio)

  const targetEntries: StackedBarEntry[] = [
    {
      label: "known",
      color: colorByBucket.known,
      weight: preferredKnownRatio,
    },
    {
      label: "unknown",
      color: colorByBucket.learning,
      weight: 1 - preferredKnownRatio,
    },
  ]

  return (
    <div className={cn(className, "flex flex-col gap-4")}>
      <p>Buckets by H/S Ratio {hsRatio.toFixed(2)}</p>
      <p>Preferred Known Ratio: {preferredKnownRatio.toFixed(2)}</p>
      <StackedBarChart
        title="Target (based on H/S Ratio)"
        entries={targetEntries}
      />
      <StackedBarChartLegend entries={targetEntries} />
      <div className="px-4">
        <Slider
          value={[hsRatio]}
          onValueChange={(value) => setHsRatio(value[0])}
          min={0}
          max={1}
          step={0.001}
          className="h-8"
        />
      </div>
    </div>
  )
}
