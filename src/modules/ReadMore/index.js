import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import style from './index.module.scss'

const ReadMore = ({ data }) => {
  const { t } = useTranslation()
  const [active, setActive] = useState(false)

  return (
    <div
      className={
        classNames(
          style.block,
          active && style.active
        )
      }
    >
      <ul className={style.list}>
        {
          Object.entries(data).map(([key, value]) =>
            <li key={key}>
              <strong>{value}</strong> {key}
            </li>
          )}
      </ul>
      {
        Object.entries(data).length > 2 &&
        <button
          type={'button'}
          className={style.button}
          onClick={() => setActive(!active)}
          aria-label={t(active ? 'less' : 'more')}
        >
          {t(active ? 'less' : 'more')}
        </button>
      }
    </div>
  )
}

export default ReadMore
