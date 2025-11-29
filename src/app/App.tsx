import { useAppDispatch, useAppState } from "../state/hooks"
import cn from "classnames"
import { clearHint } from "@/state/appSlice"
import { wrapClick } from "@/util/wrapClick"
import { useKeyboardHandling } from "@/state/useKeyboardHandling"
import { ProgressDeepDive } from "@/progress/ProgressDeepDive"
import { MenuBar } from "./MenuBar"
import { Home } from "./Home"
import { HistoryView } from "@/progress/HistoryView"

function App() {
  const dispatch = useAppDispatch()
  useKeyboardHandling()

  const nav = useAppState((s) => s.nav)

  return (
    <div
      className={cn("w-screen h-screen bg-neutral-900")}
      onClick={wrapClick((e) => {
        dispatch(clearHint())
      })}
    >
      {nav === "Home" && <Home />}
      {nav === "Progress" && <ProgressDeepDive />}
      {nav === "History" && <HistoryView />}
      <div className="absolute bottom-4 w-full flex justify-center pointer-events-none">
        <MenuBar className="bg-neutral-800 overflow-hidden rounded-full pointer-events-auto" />
      </div>
    </div>
  )
}

export default App
