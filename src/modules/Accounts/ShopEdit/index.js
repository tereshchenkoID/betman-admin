import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import General from './General'
import Websites from './Websites'
import Lobby from './Lobby'
import Bonuses from './Bonuses'
import Jackpots from './Jackpots'

import style from './index.module.scss'

const TABS = [
  { key: 'general', component: General },
  { key: 'lobby', component: Lobby },
  { key: 'websites', component: Websites },
  { key: 'bonuses', component: Bonuses },
  { key: 'jackpots', component: Jackpots }
]

const ShopEdit = ({ data }) => {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)

  const ActiveComponent = TABS[active].component

  return (
    <div className={style.block}>
      <div className={style.header}>
        {
          TABS.map((el, idx) =>
            <button
              key={idx}
              className={
                classNames(
                  style.link,
                  active === idx && style.active
                )
              }
              onClick={() => setActive(idx)}
            >
              {t(el.key)}
            </button>
          )
        }
      </div>
      <div className={style.body}>
        <ActiveComponent data={{ type: data.type }} />
      </div>
    </div>
  )
}

export default ShopEdit
