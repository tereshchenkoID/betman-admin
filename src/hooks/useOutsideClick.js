import { useEffect } from 'react'

export const useOutsideClick = (elementRef, handler, { attached = true, meta = {} } = {}) => {
  useEffect(() => {
    if (!attached) return;

    const handleClick = (e) => {
      if (!elementRef.current) return;

      if (meta.buttonRef?.current?.contains(e.target)) return;
      if (!elementRef.current.contains(e.target)) {
        handler(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [elementRef, handler, attached, meta.buttonRef])
}
