import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import style from './index.module.scss'

const Clock = () => {
  const { t } = useTranslation()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className={style.block}>
      <h6>{t('title')}</h6>
      <div>{time.toLocaleString()}</div>
    </div>
  )
}

export default Clock
