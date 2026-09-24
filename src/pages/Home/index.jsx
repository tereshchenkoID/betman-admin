import { Outlet } from 'react-router-dom'

import Aside from 'components/Aside'
import Header from 'components/Header'
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
