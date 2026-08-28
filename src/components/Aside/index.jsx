import { lazy, Suspense } from 'react'
import clsx from 'clsx'

import { useAsideStore } from 'src/stores/asideStore'

import Paper from 'components/Paper'
import Loader from "components/Loader"

import style from './index.module.scss'

const UserAdd = lazy(() => import('modules/Accounts/UserAdd'))
const UserEdit = lazy(() => import('modules/Accounts/UserEdit'))
const PlayerAdd = lazy(() => import('modules/Accounts/PlayerAdd'))
const PlayerEdit = lazy(() => import('modules/Accounts/PlayerEdit'))

const Deposit = lazy(() => import('modules/Accounts/Deposit'))
const Withdrawal = lazy(() => import('modules/Accounts/Withdrawal'))
const Confirmed = lazy(() => import('modules/Confirmed'))

const components = {
  'user-add': UserAdd,
  'user-edit': UserEdit,
  'player-add': PlayerAdd,
  'player-edit': PlayerEdit,


  'account-deposit': Deposit,
  'account-withdrawal': Withdrawal,
  'confirmed': Confirmed,
}

const checkCmd = (cmd) => {
  const Component = components[cmd.meta.cmd]
  return Component ? <Component mock={cmd} /> : null
}

const Aside = () => {
  const { aside } = useAsideStore()

  return (
    <aside
      className={
        clsx(
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
