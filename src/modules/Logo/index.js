import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { NAVIGATION } from 'constant/config'

import { setAside } from 'store/actions/asideAction'

import style from './index.module.scss'

const Logo = () => {
  const dispatch = useDispatch()
  const { settings } = useSelector(state => state.settings)

  return (
    <Link
      to={NAVIGATION.home.link}
      rel="noreferrer"
      className={style.block}
      onClick={() => {
        dispatch(setAside(null))
      }}
    >
      <img
        src={settings?.assets?.logo}
        width={42}
        height={42}
        alt="logo"
      />
    </Link>
  )
}

export default Logo
