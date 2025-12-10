export function DebugItem({
  text,
  value,
}: {
  text: string
  value: string | number
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <p className="opacity-60">{text}</p>
      <p className="bg-black font-mono px-1 text-amber-200">{value}</p>
    </div>
  )
}
