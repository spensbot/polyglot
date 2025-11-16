import { cn } from "@/lib/utils"

export function TitleView({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* <img src="/favicon.svg" alt="Logo" className="h-10 w-10" /> */}
      <h1 className="text-4xl font-bold">Polyglot</h1>
      <p className="text-lg text-gray-400 mt-4 ml-2">
        Learn language through story
      </p>
    </div>
  )
}
