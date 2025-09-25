import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ImagePreview from 'modules/ImagePreview'

import style from './index.module.scss'

const JackpotCard = ({ data, currentTranslation }) => {
  const { t } = useTranslation()

  const listRef = useRef(null)

  return (
    <div
      className={style.block}
      style={{
        backgroundImage: `url(/images/coins.webp)`,
      }}
    >
      <div className={style.logo}>
        {
          data?.image &&
          <ImagePreview
            image={data?.image}
            width={164}
            height={65}
            alt={data?.title}
          />
        }
      </div>
      <div className={style.info}>{currentTranslation?.title}</div>
      <div className={style.total}>
        <p className={style.label}>{t('jackpot_total')}</p>
        <div className={style.amount}>
          <h3 className={style.number}>{data.amount}</h3>
          <h4 className={style.currency}>{data.currency}</h4>
        </div>
      </div>
      <p className={style.currency}>{data.title}</p>
      <NavLink
        to={'/'}
        className={style.eligible}
      >
        <strong className={style.badge}>
          {data.games?.length}
        </strong>
        <p>{t('all_games')}</p>
        <FontAwesomeIcon
          icon={'fa-solid fa-chevron-right'}
          className={style.icon}
        />
      </NavLink>
      <div
        ref={listRef}
        className={style.games}
      >
        {
          data.games?.slice(-6)?.map((el, idx) =>
            <div
              key={idx}
              className={style.game}
            >
              <div
                style={{
                  backgroundImage: `url(/images/card.png)`,
                }}
                className={style.picture}
              />
              <h3 className={style.title}>{el.name}</h3>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default JackpotCard
