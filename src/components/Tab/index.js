import React from 'react'
import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import style from './index.module.scss'

const Tab = ({ data, action, options }) => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      {
        options.map(([key, value]) =>
          <button
            key={key}
            className={
              classNames(
                style.link,
                data === key && style.active
              )
            }
            onClick={() => action(key)}
          >
            {t(value)}
          </button>
        )
      }
    </div>
  )
}

export default Tab
