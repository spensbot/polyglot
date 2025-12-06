import { cn } from "@/lib/utils"

export interface StackedBarEntry {
  label: string
  color: string
  weight: number
}

interface StackedBarEntryWithPct extends StackedBarEntry {
  pct: number
}

function withPcts(entries: StackedBarEntry[]): StackedBarEntryWithPct[] {
  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0)
  return entries.map((e) => ({
    ...e,
    pct: totalWeight > 0 ? e.weight / totalWeight : 0,
  }))
}

export function StackedBarChartLegend({
  entries,
}: {
  entries: StackedBarEntry[]
}) {
  return (
    <div className="flex flex-row gap-4">
      {entries.map((e) => (
        <div key={e.label} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: e.color }}
          ></div>
          <p className="opacity-50">{e.label}</p>
        </div>
      ))}
    </div>
  )
}

export function StackedBarChart({
  title,
  className,
  entries,
}: {
  title?: string
  className?: string
  entries: StackedBarEntry[]
}) {
  const entriesWithPcts = withPcts(entries)

  return (
    <div className="flex flex-col">
      {title && <h3 className="text-sm opacity-50">{title}</h3>}
      <div
        className={cn(
          "flex w-full gap-1 min-h-4 min-w-10 max-w-xl items-stretch",
          className
        )}
      >
        {entriesWithPcts.map((e) => (
          <div
            className={cn("h-full rounded-sm text-sm px-1")}
            style={{
              flexGrow: e.pct,
              flexBasis: 0,
              backgroundColor: e.color,
            }}
          >
            <p className="w-fit drop-shadow-[0_0_8px_rgba(0,0,0,1)]">
              {(e.pct * 100).toFixed(0)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
