import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { setAside } from 'store/actions/asideAction'

import Button from 'components/Button'

import style from './index.module.scss'

import classNames from 'classnames'

const Place = ({ info }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const isActive = info?.status === '1'
  const isAlarm = Number(info?.rtp) > 100
  const isLose = Number(info?.profit) < 0
  const [timer, setTimer] = useState('00:00:00')

  useEffect(() => {
    if (!isActive || !info?.session_started) return

    const updateTimer = () => {
      const diff = Date.now() - info.session_started
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0')
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')

      setTimer(`${hours}:${minutes}:${seconds}`)
    }

    updateTimer()

    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [isActive, info?.session_started])

  const handlePlaceLogin = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('login'),
          cmd: 'hall-place-login',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handlePlaceInfo = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('info'),
          cmd: 'hall-place-info',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  return (
    <div className={style.block}>
      <strong className={style.host}>{info?.host}</strong>
      <div className={style.wrapper}>
        <div className={style.left}>
          <FontAwesomeIcon
            icon="fa-solid fa-computer"
            className={
              classNames(
                style.icon,
                isActive && style.active
              )
            }
          />
          <Button
            classes={['error']}
            placeholder={t('alarm')}
            onClick={() => alert('Alarm!')}
            isDisabled={!isAlarm}
          />
        </div>
        <div className={style.right}>
          {
            isActive &&
            <>
              <p>{t('profit')}: <strong className={classNames(style.value, isLose && style.red)}>{info?.profit}</strong> {info?.currency}</p>
              <p>{t('rtp')}: <strong className={classNames(style.value, isAlarm && style.red)}>{info?.rtp}</strong> %</p>
              <p>{t('total_balance')}: <strong>{info?.balance.total}</strong> {info?.currency}</p>
              <p>{t('session')}: <strong>{timer}</strong></p>
            </>
          }
          <div className={style.actions}>
            <Button
              classes={['primary']}
              placeholder={t('login')}
              onClick={e => handlePlaceLogin(e, info)}
            />
            <Button
              classes={['tertiary']}
              placeholder={t('info')}
              onClick={e => handlePlaceInfo(e, info)}
              isDisabled={!isActive}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Place
