import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { service } from 'src/constant/config'

import { fixed } from 'src/helpers/fixed'
import { hexToRgba } from 'src/helpers/hexToRgba'

import Paper from 'components/Paper'

import style from './index.module.scss'

const OnlineMonitor = ({ data }) => {
  const { t } = useTranslation()

  return (
    <Paper headline={t('online_monitors')}>
      <div className={style.block}>
        <div className={style.list}>
          {
            data?.online?.map((el, idx) =>
              <div
                key={idx}
                className={style.item}
              >
                <div
                  className={style.circle}
                  style={{ backgroundColor: hexToRgba(service.COLORS[idx], 0.5) }}
                >
                  <h4>{el.value}</h4>
                </div>
                <h6>{t(el.name)}</h6>
              </div>
            )
          }
        </div>
        <div className={style.list}>
          {
            data?.jackpots?.map((el, idx) =>
              <div
                key={idx}
                className={
                  clsx(
                    style.item,
                    style.wide
                  )
                }
              >
                <hr
                  className={style.line}
                  style={{ backgroundColor: hexToRgba(service.COLORS[idx], 0.5) }}
                />
                <div className={style.title}>
                  <h4>{fixed(el.amount)}</h4>
                  <p>{el.currency}</p>
                </div>
                <h6>{el.name}</h6>
              </div>
            )
          }
        </div>
      </div>
    </Paper>
  )
}

export default OnlineMonitor
