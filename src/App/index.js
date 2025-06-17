import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import Login from 'pages/Login'
import Home from 'pages/Home'
import Toastify from 'components/Toastify'

import style from './index.module.scss'

const App = () => {
  const { auth } = useSelector(state => state.auth)

  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then(config => {
        localStorage.setItem('config', JSON.stringify(config.hostnames))
      })
  }, [])

  return (
    <div className={style.root}>
      <Toastify />
      {auth && sessionStorage.getItem('authToken') ? <Home /> : <Login />}
    </div>
  )
}

export default App
library.add(fab, fas, far)
