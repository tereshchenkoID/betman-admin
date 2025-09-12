import { useEffect, useState } from 'react'
import { getData } from 'helpers/api'

export const useOptions = (endpoint, mapper, defaultOptions = [], enabled = true) => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!enabled) {
      setOptions(defaultOptions)
      setLoading(false)
      return
    }

    const fetchOptions = async () => {
      try {
        const json = await getData(endpoint)

        if (json) {
          let mapped = []
          mapped = Object.entries(json).map(([id, username]) =>
            mapper({id: Number(id), username})
          )
          setOptions([...defaultOptions, ...mapped])
        }
        else {
          setOptions(defaultOptions)
        }
      } catch (err) {
        console.error(`Failed to load options from ${endpoint}:`, err)
        setOptions(defaultOptions)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [endpoint, JSON.stringify(defaultOptions)])

  return { options, loading }
}
