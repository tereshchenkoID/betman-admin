import { useState, useCallback } from 'react'

export const useFilterState = (initialValue = {}) => {
  const [filter, setFilter] = useState(initialValue || null)

  const handlePropsChange = useCallback((fieldName, fieldValue) => {
    setFilter(prevData => {
      const updated = structuredClone(prevData)
      const keys = fieldName
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')

      let obj = updated
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        obj[key] = Array.isArray(obj[key]) ? [...obj[key]] : { ...obj[key] }
        obj = obj[key]
      }

      obj[keys[keys.length - 1]] = fieldValue
      return updated
    })
  }, [])

  return { filter, setFilter, handlePropsChange }
}
