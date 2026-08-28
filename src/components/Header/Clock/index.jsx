import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ACCOUNT_TYPE } from 'src/constant/config'
import { useAuthStore } from 'src/stores/authStore'

import style from './index.module.scss'

const Clock = () => {
  const { t } = useTranslation()
  const { auth } = useAuthStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className={style.block}>
      <h6>{t('role')}: {t(`account_types.${ACCOUNT_TYPE[auth?.role]}`)}</h6>
      <div>{time.toLocaleString()}</div>
    </div>
  )
}

export default Clock
