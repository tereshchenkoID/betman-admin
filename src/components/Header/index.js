import React from 'react'
import { useSelector } from 'react-redux'

import Clock from './Clock'
import Language from './Language'
import Account from './Account'

import style from './index.module.scss'

const Header = () => {
  const { auth } = useSelector(state => state.auth)

  return (
    <header className={style.block}>
      <Clock />
      <p className={style.balance}>
        {
          Object.entries(auth.credits).map(([key, value]) =>
            <p key={key}>
              <strong>{value}</strong> {key}
            </p>
          )
        }
      </p>
      <Language />
      <Account />
    </header>
  )
}

export default Header
