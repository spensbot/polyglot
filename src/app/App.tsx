import { useAppDispatch, useAppState } from "../state/hooks"
import cn from "classnames"
import { clearHint } from "@/state/appSlice"
import { wrapClick } from "@/util/wrapClick"
import { useKeyboardHandling } from "@/state/useKeyboardHandling"
import { ProgressView } from "@/progress/ProgressView"
import { Home } from "./Home"
import { HistoryView } from "@/progress/HistoryView"
import { MenuBar } from "./MenuBar"

function App() {
  const dispatch = useAppDispatch()
  useKeyboardHandling()

  const nav = useAppState((s) => s.nav)

  return (
    <div
      className={cn("w-screen h-screen bg-neutral-900 flex flex-col")}
      onClick={wrapClick((e) => {
        dispatch(clearHint())
      })}
    >
      <div className="flex-1 min-h-0">
        {nav === "Home" && <Home />}
        {nav === "Progress" && <ProgressView />}
        {nav === "History" && <HistoryView />}
      </div>
      <div className="bottom-9 w-full flex justify-center bg-neutral-800 border-t">
        <MenuBar className="bg-neutral-800 pointer-events-auto" />
      </div>
    </div>
  )
}

export default App
