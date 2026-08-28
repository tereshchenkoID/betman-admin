import { useState, useEffect } from 'react'

export const useBreakpoints = () => {
  const getValues = () => {
    const width = window.innerWidth
    return {
      bp360: width >= 360,
      bp560: width >= 560,
      bp768: width >= 768,
      bp992: width >= 992,
      bp1024: width >= 1024,
      bp1280: width >= 1280,
      bp1440: width >= 1440,
    }
  }

  const [values, setValues] = useState(
    typeof window !== 'undefined' ? getValues() : {}
  )

  useEffect(() => {
    const handleResize = () => setValues(getValues())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return values
}
