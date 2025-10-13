import React, { useEffect, useState } from 'react'

import { ACCOUNT_TYPE } from 'constant/config'

import { useAuth } from 'hooks/useAuth'

import Hall from './Hall'
import Report from './Report'
import Login from './Login'

import style from './index.module.scss'

const Dashboard = () => {
  const { auth } = useAuth()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(auth.shift?.status === '1')
  }, [auth.shift])

  return (
    <div className={style.block}>
      {
        (auth.role === ACCOUNT_TYPE['SHOP'] || auth.role === ACCOUNT_TYPE['CASHIER']) &&
        <>
          {
            active
              ? <Hall active={active} setActive={setActive} />
              : <Login active={active} setActive={setActive} />
          }
        </>
      }
      {
        (auth.role === ACCOUNT_TYPE['ADMIN'] || auth.role === ACCOUNT_TYPE['AGENT']) &&
        <Report />
      }
    </div>
  )
}

export default Dashboard
