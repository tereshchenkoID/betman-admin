import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from 'components/Button'

import style from './index.module.scss'

import classNames from 'classnames'

const Place = ({ info }) => {
  const { t } = useTranslation()

  const isActive = Number(info?.status) === 1
  const [elapsed, setElapsed] = useState('00:00:00')

  useEffect(() => {
    if (!isActive || !info?.session_started) return

    const updateTimer = () => {
      const diff = Date.now() - info.session_started
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0')
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      setElapsed(`${hours}:${minutes}:${seconds}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [isActive, info?.session_started])

  return (
    <div className={style.place}>
      <FontAwesomeIcon
        icon={`fa-solid fa-computer`}
        className={classNames(style.icon, {[style['icon--active']]: isActive})}
      />
      <div className={style.content}>
        <p className={style.host}>Host: { info?.host }</p>
        {
          isActive &&
          <>
            <p>Profit: {info?.profit} {info?.currency}</p>
            <p>rtp: {info?.rtp}% </p>
            <p>Total balance: {info?.balance.total} {info?.currency}</p>
            <p>Session: {elapsed}</p>
            <div className={style.actions}>
              <Button
                placeholder={t('login')}
              />
              <Button
                classes={['primary']}
                placeholder={t('alarm')}
                onClick={() => alert('Alarm!')}
              />
              <Button
                classes={['tertiary']}
                placeholder={t('more')}
              />
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default Place
