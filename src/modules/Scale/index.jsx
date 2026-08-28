import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import style from './index.module.scss'

const Scale = ({
  amount,
  max,
  percentage,
  currency = '',
  isInverted = false,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={
        clsx(
          style.block,
          isInverted && style.inverted
        )
      }
    >
      <div className={style.header}>
        <strong>{amount} {currency}</strong>
        <p>{t('off')}</p>
        <strong>{max} {currency}</strong>
      </div>
      <div className={style.scale}>
        <div
          className={style.value}
          style={{
            width: `${percentage}%`,
          }}
        />
        <p className={style.percent}>{percentage}%</p>
      </div>
    </div>
  )
}

export default Scale
