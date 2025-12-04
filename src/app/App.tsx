import { useAppDispatch, useAppState } from "../state/hooks"
import cn from "classnames"
import { clearHint } from "@/state/appSlice"
import { wrapClick } from "@/util/wrapClick"
import { useKeyboardHandling } from "@/state/useKeyboardHandling"
import { ProgressView } from "@/progress/ProgressView"
import { Home } from "./Home"
import { HistoryView } from "@/progress/HistoryView"
import { MenuBar } from "./MenuBar"
import "@/dictionary/Dictionary" // Ensure dictionary is loaded
import { ModalsView } from "./ModalView"

function App() {
  const dispatch = useAppDispatch()
  useKeyboardHandling()

  const nav = useAppState((s) => s.nav)

  return (
    <div
      className={cn("w-full h-full bg-neutral-900 flex flex-col select-none")}
      onClick={wrapClick((e) => {
        dispatch(clearHint())
      })}
    >
      <div className="flex-1 min-h-0">
        {nav === "Home" && <Home />}
        {nav === "Progress" && <ProgressView />}
        {nav === "History" && <HistoryView />}
      </div>
      <MenuBar className="bg-neutral-800 pointer-events-auto " />
      <ModalsView />
    </div>
  )
}

export default App
