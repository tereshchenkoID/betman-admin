import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotify } from 'hooks/useNotify'
import { getData, postData } from 'helpers/api'

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
        successMessage: null
      }
    ) => {
      setLoading(true)
      setError(null)

      try {
        const apiFn = method === 'GET' ? getData : postData
        const json = await apiFn(url, payload)

        if (json?.code === '0') {
          notify(json, opts?.successMessage)
          return json
        } else {
          notify(json, opts?.errorMessage || t('notification.failed_request'))
          return { data: null }
        }
      } catch (err) {
        notify({ code: '1', message: err?.message }, opts?.errorMessage)
        setError(err)
        return { data: null }
      } finally {
        setLoading(false)
      }
    },
    [notify, t]
  )

  return { request, loading, error }
}
