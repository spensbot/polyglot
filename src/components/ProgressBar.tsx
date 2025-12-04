import { cn } from "@/lib/utils"

export function ProgressBar({
  percent,
  className,
}: {
  percent: number
  className?: string
}) {
  return (
    <div className={cn("bg-white/10 relative", className)}>
      <div
        className="bg-blue-500 absolute top-0 left-0 bottom-0"
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  )
}
