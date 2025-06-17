import React from 'react'

import Clock from './Clock'
import Language from './Language'

import style from './index.module.scss'
import Account from './Account'

const Header = () => {
  return (
    <header className={style.block}>
      <Clock />
      <Language />
      <Account />
    </header>
  )
}

export default Header
