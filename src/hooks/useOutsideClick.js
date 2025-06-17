import { useEffect } from 'react'

export const useOutsideClick = (elementRef, handler, attached = true) => {
  useEffect(() => {
    if (!attached) return

    const handleClick = e => {
      if (!elementRef.current) return
      if (!elementRef.current && !attached.buttonRef.current) return
      if (e.target === attached.meta.buttonRef) return
      if (!elementRef.current.contains(e.target)) {
        handler(false)
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [elementRef, handler, attached])
}
