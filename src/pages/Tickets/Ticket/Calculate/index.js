import React from 'react'
import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import style from './index.module.scss'

const Calculate = ({ active, data, action, setCalculate }) => {
  const { t } = useTranslation()

  return (
    <button
      className={classNames(style.block, !active && style.disabled)}
      onClick={data ? action : setCalculate}
      title={t('calculate')}
    >
      {data ? (
        <FontAwesomeIcon
          icon="fa-solid fa-floppy-disk"
          className={style.icon}
        />
      ) : (
        <FontAwesomeIcon icon="fa-solid fa-calculator" className={style.icon} />
      )}
    </button>
  )
}

export default Calculate
