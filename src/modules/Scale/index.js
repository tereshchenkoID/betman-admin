import classNames from 'classnames'

import style from './index.module.scss'

const Scale = ({
  amount,
  max,
  percentage,
  currency = '',
  isInverted = false,
}) => {
  return (
    <div
      className={
        classNames(
          style.block,
          isInverted && style.inverted
        )
      }
    >
      <div className={style.header}>
        <strong>{amount} {currency} ({percentage})%</strong>
        <strong>{max} {currency}</strong>
      </div>
      <div className={style.scale}>
        <div
          className={style.value}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  )
}

export default Scale
