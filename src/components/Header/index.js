import React from 'react'

import { useAuth } from 'hooks/useAuth'

import Clock from './Clock'
import Language from './Language'
import Account from './Account'

import style from './index.module.scss'

const Header = () => {
  const { auth } = useAuth()

  return (
    <header className={style.block}>
      <Clock />
      <div className={style.balance}>
        {
          Object.entries(auth?.credits).map(([key, value]) =>
            <p key={key}>
              <strong>{value}</strong> <span>{key}</span>
            </p>
          )
        }
      </div>
      <Language />
      <Account />
    </header>
  )
}

export default Header
