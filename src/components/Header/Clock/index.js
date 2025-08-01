import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'

import { ACCOUNT_TYPE } from "constant/config"

import style from './index.module.scss'

const Clock = () => {
  const { t } = useTranslation()
  const { auth } = useSelector(state => state.auth)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const role = useMemo(() => {
    return Object.entries(ACCOUNT_TYPE).find(([key, val]) => val === auth?.role)?.[0] || null
  }, [])

  return (
    <div className={style.block}>
      <h6>{t('role')}: {role} ({auth?.role})</h6>
      <div>{time.toLocaleString()}</div>
    </div>
  )
}

export default Clock
