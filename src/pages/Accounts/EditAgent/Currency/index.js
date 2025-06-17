import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import classNames from 'classnames'

import { types } from 'constant/config'

import Stakes from './Stakes'
import Jackpot from './Jackpot'

import style from './index.module.scss'

const Currency = ({ data, inherit }) => {
  const { t } = useTranslation()
  const { auth } = useSelector(state => state.auth)
  const { settings } = useSelector(state => state.settings)
  const [active, setActive] = useState(settings.currencies[0])
  const [tab, setTab] = useState(0)
  const isAdmin = auth.type === types.ACCOUNT_TYPE.Admin

  return (
    <div className={style.block}>
      <div className={style.currencies}>
        {settings.currencies.map((el, idx) => (
          <button
            key={idx}
            type={'button'}
            className={classNames(
              style.currency,
              active === el && style.active,
            )}
            onClick={() => setActive(el)}
          >
            {el}
          </button>
        ))}
      </div>
      <div className={style.tab}>
        <button
          type={'button'}
          className={classNames(style.link, tab === 0 && style.active)}
          onClick={() => setTab(0)}
        >
          {t('stakes')}
        </button>
        {
          isAdmin &&
          <button
            type={'button'}
            className={classNames(style.link, tab === 1 && style.active)}
            onClick={() => setTab(1)}
          >
            {t('jackpots')}
          </button>
        }
      </div>
      <div>
        {tab === 0 && (
          <Stakes data={data} currency={active} inherit={inherit} />
        )}
        {tab === 1 && (
          <Jackpot data={data} currency={active} inherit={inherit} />
        )}
      </div>
    </div>
  )
}

export default Currency
