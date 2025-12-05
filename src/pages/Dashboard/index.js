import React, { useEffect, useState } from 'react'

import { ACCOUNT_TYPE } from 'constant/config'

import { useAuthStore } from 'stores/authStore'

import Hall from './Hall'
import Report from './Report'
import Login from './Login'

import style from './index.module.scss'

const Dashboard = () => {
  const { auth} = useAuthStore()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(auth.shift?.status === '1')
  }, [auth?.shift])

  return (
    <div className={style.block}>
      {
        (auth?.role === ACCOUNT_TYPE['CASHIER'])
          ?
            <>
              {
                active
                  ? <Hall active={active} setActive={setActive} />
                  : <Login active={active} setActive={setActive} />
              }
            </>
          :
            <Report />
      }
    </div>
  )
}

export default Dashboard
