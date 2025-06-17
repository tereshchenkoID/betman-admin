import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, Outlet } from 'react-router-dom'

import { setSettings } from 'store/actions/settingsAction'
import { setAgents } from 'store/actions/agentsAction'

import Loader from 'components/Loader'
import Header from 'components/Header'
import Aside from 'components/Aside'
import Nav from 'components/Nav'

import style from './index.module.scss'

const Home = () => {
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    dispatch(setSettings())
    dispatch(setAgents()).then(json => {
      if(json) {
        setLoading(false)
        setLoaded(true)
      }
    })
  }, [dispatch])

  useEffect(() => {
    if (!loaded)
      return

    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <Nav />
      <Aside />
      <main className={style.main}>
        <Outlet />
      </main>
    </>
  )
}

export default Home
