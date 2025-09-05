import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from 'components/Header'
import Aside from 'components/Aside'
import Nav from 'components/Nav'

import style from './index.module.scss'

const Home = () => {
  return (
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
