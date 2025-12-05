import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from 'stores/authStore'
import { role } from 'helpers/role'

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
      <h6>{t('role')}: {role(auth?.role)}</h6>
      <div>{time.toLocaleString()}</div>
    </div>
  )
}

export default Clock
