import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'

import style from './index.module.scss'

const Icon = ({
  icon,
  action,
  disabled = false,
  classes = [],
  alt
}) => {
  const { t } = useTranslation()

  return (
    <button
      type={'button'}
      className={
        clsx(
          style.block,
          disabled && style.disabled,
          classes && classes.map(el => style[el] || el),
        )
      }
      onClick={action}
      title={t(alt || 'icon')}
      aria-label={t(alt || 'icon')}
    >
      <FontAwesomeIcon icon={`fa-solid ${icon}`} className={style.icon} />
    </button>
  )
}

export default Icon
