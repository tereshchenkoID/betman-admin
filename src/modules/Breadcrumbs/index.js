import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import style from './index.module.scss'

const Breadcrumbs = ({ data, current = false }) => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      {
        data.map((el, idx) =>
          <React.Fragment key={idx}>
            <Link
              to={el.link}
              rel="noreferrer"
              className={style.link}
            >
              {t(el.text)}
            </Link>
            {
              data.length - 1 !== idx &&
              <span className={style.text}>/</span>
            }
          </React.Fragment>
        )
      }
      {
        current &&
        <>
          <p className={style.text}>/</p>
          <p className={style.text}>{t(current.text)}</p>
        </>
      }
    </div>
  )
}

export default Breadcrumbs
