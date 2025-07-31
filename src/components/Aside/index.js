import React from 'react'
import { useSelector } from 'react-redux'

import classNames from 'classnames'

import Paper from 'components/Paper'
import Settings from "modules/Settings"
import Deposit from 'modules/Accounts/Deposit'
import Withdrawal from 'modules/Accounts/Withdrawal'
import Shop from 'modules/Accounts/Shop'
import Player from 'modules/Accounts/Player'
import Cashier from 'modules/Accounts/Cashier'
import PlayerInfo from 'modules/Accounts/PlayerInfo'
import PlayerEdit from 'modules/Accounts/PlayerEdit'
import CashierEdit from 'modules/Accounts/CashierEdit'
import ShopEdit from 'modules/Accounts/ShopEdit'
import Confirmed from 'modules/Confirmed'

import style from './index.module.scss'

const checkCmd = data => {
  switch (data.meta.cmd) {
    case 'settings':
      return <Settings data={data} />
    case 'account-deposit':
      return <Deposit data={data} />
    case 'account-withdrawal':
      return <Withdrawal data={data} />
    case 'account-shop':
      return <Shop data={data} />
    case 'account-player':
      return <Player data={data} />
    case 'account-cashier':
      return <Cashier data={data} />
    case 'account-player-info':
      return <PlayerInfo data={data} />
    case 'account-player-edit':
      return <PlayerEdit data={data} />
    case 'account-cashier-edit':
      return <CashierEdit data={data} />
    case 'account-shop-edit':
      return <ShopEdit data={data} />
    case 'confirmed':
      return <Confirmed data={data} />
    default:
      return null
  }
}

const Aside = () => {
  const { aside } = useSelector(state => state.aside)

  return (
    <aside
      className={
        classNames(
          style.block,
          aside && style.active
        )
      }
    >
      {
        aside &&
        <div className={style.wrapper}>
          <Paper
            headline={aside.meta.title}
            classes={['transparent', 'sm']}
            quantity={false}
            close={true}
          >
            {checkCmd(aside)}
          </Paper>
        </div>
      }
    </aside>
  )
}

export default Aside
