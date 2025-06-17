import React from 'react'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import classNames from 'classnames'

import style from './index.module.scss'

const Dropdown = ({ data, disabled, action, loading }) => {
  const { t } = useTranslation()

  return (
    <button
      className={classNames(
        style.block,
        data && style.active,
        disabled && style.disabled,
      )}
      type={'button'}
      onClick={action}
      title={t('dropdown')}
    >
      {loading ? (
        <FontAwesomeIcon
          icon="fa-solid fa-spinner"
          className={style.icon}
          spinPulse
        />
      ) : (
        <FontAwesomeIcon icon="fa-solid fa-plus" className={style.icon} />
      )}
    </button>
  )
}

export default Dropdown
