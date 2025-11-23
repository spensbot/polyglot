import { CodeXml } from "lucide-react"
import { Button } from "./ui/button"

interface Props {
  label: string
  onClick: () => void
}

export function DebugButton({ label, onClick }: Props) {
  if (!import.meta.env.DEV) return null

  return (
    <Button
      size="lg"
      onClick={onClick}
      className="flex items-center border-4 border-fuchsia-400 bg-fuchsia-800 text-white"
    >
      <CodeXml />
      {label}
    </Button>
  )
}
