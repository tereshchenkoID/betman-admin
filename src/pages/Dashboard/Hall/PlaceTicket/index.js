import React, { useState, Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import Loader from 'components/Loader'

import style from './index.module.scss'

const Deposit = lazy(() => import('./Deposit'))
const Withdrawal = lazy(() => import('./Withdrawal'))

const TABS = [
  { key: 'deposit', component: Deposit },
  { key: 'withdrawal', component: Withdrawal }
]

const PlaceTicket = ({ mock }) => {
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
              type="button"
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
        <Suspense fallback={<Loader type={'content'} />}>
          <ActiveComponent data={{ key: TABS[active].key }} />
        </Suspense>
      </div>
    </div>
  )
}

export default PlaceTicket
