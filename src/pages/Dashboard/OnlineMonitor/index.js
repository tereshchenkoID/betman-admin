import React from 'react'
import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import { service } from 'constant/config'

import { hexToRgba } from 'helpers/hexToRgba'
import { convertFixed } from 'helpers/convertFixed'

import Paper from 'components/Paper'

import style from './index.module.scss'

const OnlineMonitor = ({ data }) => {
  const { t } = useTranslation()

  return (
    <Paper headline={t('online_monitors')}>
      <div className={style.block}>
        <div className={style.list}>
          {data.online.map((el, idx) => (
            <div className={style.item} key={idx}>
              <div
                className={style.circle}
                style={{ backgroundColor: hexToRgba(service.COLORS[idx], 0.5) }}
              >
                <h4>{el.value}</h4>
              </div>
              <h6>{t(el.name)}</h6>
            </div>
          ))}
        </div>
        <div className={style.list}>
          {data.jackpots.map((el, idx) => (
            <div className={classNames(style.item, style.wide)} key={idx}>
              <hr
                className={style.line}
                style={{ backgroundColor: hexToRgba(service.COLORS[idx], 0.5) }}
              />
              <div className={style.title}>
                <h4>{convertFixed(el)}</h4>
                <p>{data.settings.currency}</p>
              </div>
              <h6>{t(`jackpot_${idx + 1}_contribution`)}</h6>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  )
}

export default OnlineMonitor
