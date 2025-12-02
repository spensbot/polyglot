import { Modal } from "@/components/Modal"
import { Setup } from "./Setup"
import { useAppState } from "@/state/hooks"

export function ModalsView() {
  const modal = useAppState((s) => s.modal)

  return <Modal>{modal === "Setup" && <Setup />}</Modal>
}
