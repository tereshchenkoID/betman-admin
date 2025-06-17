import React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

import style from './index.module.scss'

const Icon = ({ icon, action, disabled = false, alt, classes = null }) => {
  const { t } = useTranslation()

  return (
    <button
      type={'button'}
      className={
        classNames(
          style.block, 
          disabled && style.disabled,
          classes && classes.map(el => style[el] || el),
        )
      }
      onClick={action}
      title={t(alt || 'add')}
    >
      <FontAwesomeIcon icon={`fa-solid ${icon}`} className={style.icon} />
    </button>
  )
}

export default Icon
