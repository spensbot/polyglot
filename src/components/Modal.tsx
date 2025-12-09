export function Modal({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  if (!children) {
    return null
  }

  return (
    <div
      className="z-40 fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center"
      onClick={onClick}
    >
      <div className="bg-neutral-800 p-4 m-4 rounded-md min-w-0">
        {children}
      </div>
    </div>
  )
}
