import React from 'react'

import { ACCOUNT_TYPE } from 'constant/config'

import { useAuth } from 'hooks/useAuth'

import Hall from './Hall'
import Report from './Report'

import style from './index.module.scss'

const Dashboard = () => {
  const { auth } = useAuth()

  return (
    <div className={style.block}>
      {
        (auth.role === ACCOUNT_TYPE['SHOP'] || auth.role === ACCOUNT_TYPE['CASHIER']) &&
        <Hall />
      }
      {
        (auth.role === ACCOUNT_TYPE['ADMIN'] || auth.role === ACCOUNT_TYPE['AGENT']) &&
        <Report />
      }
    </div>
  )
}

export default Dashboard
