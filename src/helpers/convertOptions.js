import { useTranslation } from 'react-i18next'

export const convertOptions = data => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()

  return Object.entries(data).map(([key, value]) => {
    return { value: Number(key), label: t(value) }
  })
}
