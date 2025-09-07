import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'

import classNames from 'classnames'

import Paper from 'components/Paper'
import Loader from "components/Loader"

import style from './index.module.scss'

const Agent = lazy(() => import('modules/Accounts/Agent'))
const AgentEdit = lazy(() => import('modules/Accounts/AgentEdit'))
const Deposit = lazy(() => import('modules/Accounts/Deposit'))
const Withdrawal = lazy(() => import('modules/Accounts/Withdrawal'))
const Shop = lazy(() => import('modules/Accounts/Shop'))
const Player = lazy(() => import('modules/Accounts/Player'))
const Cashier = lazy(() => import('modules/Accounts/Cashier'))
const PlayerInfo = lazy(() => import('modules/Accounts/PlayerInfo'))
const PlayerEdit = lazy(() => import('modules/Accounts/PlayerEdit'))
const CashierEdit = lazy(() => import('modules/Accounts/CashierEdit'))
const ShopEdit = lazy(() => import('modules/Accounts/ShopEdit'))
const Confirmed = lazy(() => import('modules/Confirmed'))
const PlaceInfo = lazy(() => import('modules/Hall/PlaceInfo'))

const components = {
  'account-deposit': Deposit,
  'account-withdrawal': Withdrawal,
  'account-shop': Shop,
  'account-agent': Agent,
  'account-player': Player,
  'account-cashier': Cashier,
  'account-player-info': PlayerInfo,
  'account-agent-edit': AgentEdit,
  'account-shop-edit': ShopEdit,
  'account-cashier-edit': CashierEdit,
  'account-player-edit': PlayerEdit,
  'confirmed': Confirmed,
  'hall-place-info': PlaceInfo,
}

const checkCmd = (cmd) => {
  const Component = components[cmd.meta.cmd]
  return Component ? <Component data={cmd} /> : null
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
            <Suspense fallback={<Loader />}>
              {checkCmd(aside)}
            </Suspense>
          </Paper>
        </div>
      }
    </aside>
  )
}

export default Aside
