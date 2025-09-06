import React from 'react'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'
import Hall from 'modules/Hall'

import style from './index.module.scss'

const DATA = {
  cmd: 'set-list',
  topic: 'workspace',
  data: [
    {
      host: 'shop-113-1.winup.games',
      status: '1',
      session_started: 1757118422000,
      username: 'player1',
      player_id: '1112',
      total_balance: '3000.00',
      real_balance: '2000.00',
      bonus_balance: '1000.00',
      profit: '1000.00',
      rtp: '88%',
      currency: 'UAH',
      agent_id: '300',
      shop_id: '113',
      cashier_id: '222'
    },
    {
      host: 'shop-113-1.winup.games',
      status:0,
      session_started: 1757118422000,
      username: 'player1',
      player_id: '1112',
      total_balance: '3000.00',
      real_balance: '2000.00',
      bonus_balance: '1000.00',
      profit: '1000.00',
      rtp: '88%',
      currency: 'UAH',
      agent_id: '300',
      shop_id: '113',
      cashier_id: '222'
    },
    {
      host: 'shop-113-1.winup.games',
      status:0,
      session_started: 1757118422000,
      username: 'player1',
      player_id: '1112',
      total_balance: '3000.00',
      real_balance: '2000.00',
      bonus_balance: '1000.00',
      profit: '1000.00',
      rtp: '88%',
      currency: 'UAH',
      agent_id: '300',
      shop_id: '113',
      cashier_id: '222'
    }
  ]
}

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <Paper headline={t('dashboard')} classes={['sm']}>
        <Hall />
      </Paper>
    </div>
  )
}

export default Dashboard
