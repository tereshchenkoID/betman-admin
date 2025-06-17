import React from 'react'
import { useSelector } from 'react-redux'

import classNames from 'classnames'

import TicketPrint from 'pages/Tickets/TicketPrint'
import TransferAgent from 'pages/Accounts/TransferAgent'
import ChangePassword from 'pages/Accounts/ChangePassword'
import TransferMoney from 'pages/Accounts/TransferMoney'
import EditAgent from 'pages/Accounts/EditAgent'
import NewAgent from 'pages/Accounts/NewAgent'
import Paper from 'components/Paper'

import style from './index.module.scss'

const checkCmd = data => {
  switch (data.meta.cmd) {
    case 'ticket-print':
      return <TicketPrint data={data} />
    case 'account-change-password':
      return <ChangePassword data={data} />
    case 'account-transfer-agent':
      return <TransferAgent data={data} />
    case 'account-new-agent':
      return <NewAgent data={data} />
    case 'account-edit-agent':
      return <EditAgent data={data} />
    case 'account-transfer-money':
      return <TransferMoney data={data} />
    default:
      return null
  }
}

const Aside = () => {
  const { aside } = useSelector(state => state.aside)

  return (
    <aside className={classNames(style.block, aside && style.active)}>
      {aside && (
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
      )}
    </aside>
  )
}

export default Aside
