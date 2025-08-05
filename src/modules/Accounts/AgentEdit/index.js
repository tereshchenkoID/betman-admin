import React, { useState, Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import Loader from 'components/Loader'

import style from './index.module.scss'

const General = lazy(() => import('./General'))
const Websites = lazy(() => import('./Websites'))
const Bonuses = lazy(() => import('./Bonuses'))
const Jackpots = lazy(() => import('./Jackpots'))
const Game = lazy(() => import('./Game'))

const TABS = [
  { key: 'general', component: General },
  { key: 'websites', component: Websites },
  { key: 'game', component: Game },
  { key: 'bonuses', component: Bonuses },
  { key: 'jackpots', component: Jackpots }
]

const AgentEdit = ({ data }) => {
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
        <Suspense fallback={<Loader />}>
          <ActiveComponent data={{ type: data.type }} />
        </Suspense>
      </div>
    </div>
  )
}

export default AgentEdit
