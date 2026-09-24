import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import Sprite from '@/components/Sprite'

import style from './index.module.scss'

const Icon = ({
  icon,
  action,
  disabled = false,
  classes = [],
  size = '20',
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
      <Sprite name={icon} size={size} />
    </button>
  )
}

export default Icon
