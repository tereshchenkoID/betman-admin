import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotify } from 'src/hooks/useNotify'
import { getData, postData } from 'src/helpers/api'

export const useApi = () => {
  const { notify } = useNotify()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(
    async (
      method,
      url,
      payload = null,
      opts = {
        errorMessage: t('notification.failed_request'),
        successMessage: null,
        isWrapped: false
      }
    ) => {
      setLoading(true)
      setError(null)

      try {
        const apiFn = method === 'GET' ? getData : postData
        const json = await apiFn(url, payload)

        if (json?.code === '0') {
          notify(json, json.message || opts?.successMessage)
          if (opts.isWrapped)
            return { data: json,  error: null }
          return { ...json, error: null }
        } else {
          notify(json, json.error_message || opts?.errorMessage || t('notification.failed_request'))
          return { data: null, error: json.error_message }
        }
      } catch (err) {
        setError(err)
        return { data: null, error: err?.message }
        // notify({ code: '1', message: err?.message }, opts?.errorMessage)
        // setError(err)
        // return { data: null, error: err?.message }
      } finally {
        setTimeout(() => setLoading(false), 500)
      }
    },
    [notify, t]
  )

  return { request, loading, error }
}
