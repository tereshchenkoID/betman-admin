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
      balance: {
        total: '3000.00',
        real: '2000.00',
        bonus: '1000.00'
      },
      profit: '-42234.00',
      rtp: '88',
      currency: 'UAH',
      agent_id: '300',
      shop_id: '113',
      cashier_id: '222'
    },
    {
      host: 'shop-113-1.winup.games',
      status: '1',
      session_started: 1757118422000,
      username: 'player1',
      player_id: '1112',
      balance: {
        total: '3000.00',
        real: '2000.00',
        bonus: '1000.00'
      },
      profit: '1000.00',
      rtp: '88',
      currency: 'UAH',
      agent_id: '300',
      shop_id: '113',
      cashier_id: '222'
    },
    {
      host: 'shop-113-1.winup.games',
      status: '0'
    }
  ]
}

// TODO @Maksym
// host, profit (currency), rtp (%), total_balance (currency) -  показываем постоянно
// session_started - таймер живой от session_started до текущего момента
// status - 0 not active, 1 - active (сделайть кружок какой то зеленый или красный в зависимости от статуса)
// добавить кнопку more detail открываеться справа модалка и показываться все данные целиком
// логин кнопка модалка с вводом логин пароль + баланс
// alarm просто функцию заложи с алертом
// отдельный компонент на 1 робочее место

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
