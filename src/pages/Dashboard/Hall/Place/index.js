import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useAuth } from 'hooks/useAuth'
import { setAside } from 'store/actions/asideAction'
import { buildFormData } from 'helpers/buildFormData'

import Button from 'components/Button'
import Icon from 'components/Icon'
import ReadMore from 'modules/ReadMore'

import style from './index.module.scss'

const Place = ({ info }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { auth } = useAuth()
  const { request } = useApi()
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

  const handleAlarm = async (data) => {
    const formData = buildFormData(
      {
        id: data.player?.id,
        alarm: data.alarm === '0' ? '1' : '0'
      }
    )
    await request(REQUEST_TYPE.POST, 'player/alarm', formData)
  }

  const handleLogout = async (data) => {
    const formData = buildFormData(
      {
        id: data.player?.id,
      }
    )
    await request(REQUEST_TYPE.POST, 'player/logout', formData)
  }

  return (
    <div
      className={
        classNames(
          style.block,
          isActive && style.active
        )
      }
    >
      <strong className={style.host}>{info?.host}</strong>
      <div className={style.wrapper}>
        <div className={style.left}>
          <FontAwesomeIcon
            icon="fa-solid fa-computer"
            className={style.icon}
          />
          {
            isActive &&
            <>
              <Button
                classes={[info?.alarm === '0' ? 'warning' : 'error']}
                placeholder={t('alarm')}
                onClick={() => handleAlarm(info)}
                isDisabled={info?.alarm === '1'}
              />
              <Button
                classes={['error']}
                placeholder={t('logout')}
                onClick={() => handleLogout(info)}
              />
            </>
          }
        </div>
        <div className={style.right}>
          {
            isActive &&
            <>
              <div className={style.grid}>{t('player_id')}: <strong>{info?.player?.id}</strong></div>
              <div className={style.grid}>{t('profit')}: <strong className={classNames(style.value, isLose && style.red)}>{info?.profit} <span>{auth?.currency?.code}</span></strong></div>
              <div className={style.grid}>{t('rtp')}: <strong className={classNames(style.value, isAlarm && style.red)}>{info?.rtp} <span>%</span></strong></div>
              <div className={style.grid}>{t('session')}: <strong>{timer}</strong></div>
              <div className={style.grid}>{t('balance')}: <ReadMore data={info?.credits} /></div>
              <div className={style.actions}>
                <Icon
                  classes={['success']}
                  icon="fa-plus"
                  alt="deposit"
                  action={(e) => dispatch(
                    setAside({
                      meta: {
                        title: t('deposit'),
                        cmd: 'account-deposit',
                        buttonRef: e.target,
                      },
                      id: info?.player?.id,
                      ...info,
                    }),
                  )}
                />
                <Icon
                  classes={['warning']}
                  icon="fa-minus"
                  alt="withdraw"
                  action={(e) => dispatch(
                    setAside({
                      meta: {
                        title: t('withdrawal'),
                        cmd: 'account-withdrawal',
                        buttonRef: e.target,
                      },
                      id: info?.player?.id,
                      ...info,
                    }),
                  )}
                />
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Place
