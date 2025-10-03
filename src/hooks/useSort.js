import { useState, useCallback } from 'react'

export const useSort = (initialSort, handleSubmit, filter) => {
  const [sort, setSort] = useState(initialSort)

  const handleSortChange = useCallback((fieldName, sorted) => {
    if (!sorted) return

    setSort(prev => {
      if (prev.key === fieldName) {
        const nextDirection =
          prev.direction === null
            ? 'asc'
            : prev.direction === 'asc' ? 'desc' : null

        const value = {
          key: nextDirection ? fieldName : null,
          direction: nextDirection,
        }

        handleSubmit(null, 0, filter, value)
        return value
      }

      const value = { key: fieldName, direction: 'asc' }
      handleSubmit(null, 0, filter, value)
      return value
    })
  }, [handleSubmit, filter])

  return { sort, setSort, handleSortChange }
}
