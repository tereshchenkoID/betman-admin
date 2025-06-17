import React from 'react'
import { useTranslation } from 'react-i18next'

import { service } from 'constant/config'

import classNames from 'classnames'

import { hexToRgba } from 'helpers/hexToRgba'
import { convertFixed } from 'helpers/convertFixed'

import Paper from 'components/Paper'

import style from './index.module.scss'

const getLevel = data => {
  if (data <= 75) {
    return 'danger'
  } else if (data > 75 && data <= 88) {
    return 'success'
  } else if (data > 88 && data <= 95) {
    return 'danger'
  } else if (data > 95) {
    return 'error'
  } else {
    return 'default'
  }
}

const RtpControl = ({ data }) => {
  const { t } = useTranslation()

  return (
    <Paper headline={t('rtp_control')} classes={['sm']}>
      <div className={style.block}>
        {data.games.map((el, idx) => (
          <div
            className={classNames(
              style.item,
              style[getLevel(Number(el.rtp.value))],
            )}
            key={idx}
          >
            <hr
              className={style.line}
              style={{ backgroundColor: hexToRgba(service.COLORS[idx], 0.5) }}
            />
            <div className={style.circle}>
              <h6>{el.rtp.value}%</h6>
            </div>
            <div>
              <h6>{el.name}</h6>
              <p>
                {t('profit')} <strong>{convertFixed(el.rtp.profit)}</strong>{' '}
                {data.settings.currency}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  )
}

export default RtpControl
