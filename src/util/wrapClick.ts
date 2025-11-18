type Event = {
  preventDefault: () => void,
  defaultPrevented: boolean
}

export function wrapClick<E extends Event>(onClick: (e: E) => void): (event: E) => void {
  return (e: E) => {
    if (!e.defaultPrevented) {
      e.preventDefault()
      onClick(e)
    }
  }
}