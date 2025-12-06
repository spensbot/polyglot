import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { navigate, setModal } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"
import {
  BookOpen,
  Bug,
  ChartNoAxesColumnIncreasing,
  History,
} from "lucide-react"

const SETUP_LABEL = "Setup"

export function MenuBar({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const nav = useAppState((s) => s.nav)
  const debugMode = useAppState((s) => s.debug.debugMode)

  return (
    <div className={cn("flex", className)}>
      <Button
        label={SETUP_LABEL}
        variant="invisible"
        className="shrink min-w-0"
      />
      <div className="flex-1 " />
      <MenuItem
        icon={<History />}
        onClick={() => dispatch(navigate("History"))}
        active={nav === "History"}
      />
      <MenuItem
        icon={<BookOpen />}
        onClick={() => dispatch(navigate("Home"))}
        active={nav === "Home"}
      />
      <MenuItem
        icon={<ChartNoAxesColumnIncreasing />}
        onClick={() => dispatch(navigate("Progress"))}
        active={nav === "Progress"}
      />
      {(import.meta.env.DEV || debugMode) && (
        <MenuItem
          icon={<Bug className="text-fuchsia-400" />}
          onClick={() => dispatch(navigate("Debug"))}
          active={nav === "Debug"}
        />
      )}
      <div className="flex-1" />
      <Button
        label={SETUP_LABEL}
        variant="link"
        className="opacity-50 text-sm"
        onClick={() => dispatch(setModal("Setup"))}
      />
    </div>
  )
}

function MenuItem({
  onClick,
  icon,
  active,
}: {
  onClick: () => void
  icon: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 hover:bg-white/5",
        active && "bg-white/10 hover:bg-white/10"
      )}
    >
      {icon}
    </button>
  )
}
