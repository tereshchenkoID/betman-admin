import React from 'react'
import { useSelector } from 'react-redux'

import classNames from 'classnames'

import TransferAgent from 'pages/Accounts/TransferAgent'
import ChangePassword from 'pages/Accounts/ChangePassword'
import TransferMoney from 'pages/Accounts/TransferMoney'
import EditAgent from 'pages/Accounts/EditAgent'
import EditUser from 'pages/Accounts/EditUser'
import NewPlayer from 'pages/Accounts/NewPlayer'
import CreateVoucher from 'pages/Accounts/CreateVoucher'
import ImportPlayers from 'pages/Accounts/ImportPlayers'
import DepositBalance from 'pages/Accounts/DepositBalance'
import WithdrawalBalance from 'pages/Accounts/WithdrawalBalance'
import Paper from 'components/Paper'

import style from './index.module.scss'

const checkCmd = data => {
  switch (data.meta.cmd) {
    case 'account-change-password':
      return <ChangePassword data={data} />
    case 'account-transfer-agent':
      return <TransferAgent data={data} />
    case 'account-new-agent':
      return <NewPlayer data={data} />
    case 'account-create-voucher':
      return <CreateVoucher data={data} />
    case 'account-import-players':
      return <ImportPlayers data={data} />
    case 'account-deposit-balance':
      return <DepositBalance data={data} />
    case 'account-withdrawal-balance':
      return <WithdrawalBalance data={data} />
    case 'account-edit-agent':
      return <EditAgent data={data} />
    case 'account-edit-user':
      return <EditUser data={data} />
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
