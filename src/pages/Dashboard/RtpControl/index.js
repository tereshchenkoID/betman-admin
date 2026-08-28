import { useTranslation } from 'react-i18next'

import { service } from 'constant/config'

import clsx from 'clsx'

import { fixed } from 'helpers/fixed'
import { hexToRgba } from 'helpers/hexToRgba'

import Paper from 'components/Paper'

import style from './index.module.scss'

const LEVELS = [
  { max: 75, level: 'danger' },
  { max: 88, level: 'success' },
  { max: 95, level: 'danger' },
  { max: Infinity, level: 'error' },
]

const RtpControl = ({ data }) => {
  const { t } = useTranslation()
  const getLevel = (value) => (LEVELS.find(({ max }) => value <= max) || { level: 'default' }).level

  return (
    <Paper headline={t('rtp_control')} classes={['sm']}>
      <div className={style.block}>
        {
          data?.games?.map((el, idx) =>
            <div
              className={
                clsx(
                  style.item,
                  style[getLevel(Number(el.rtp.value))],
                )
              }
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
                  {t('profit')} <strong>{fixed(el.rtp.profit)}</strong>{' '}
                  {data.settings.currency}
                </p>
              </div>
            </div>
        )}
      </div>
    </Paper>
  )
}

export default RtpControl
