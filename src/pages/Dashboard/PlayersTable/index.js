import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next'

import { types } from 'constant/config'
import { setAside } from 'store/actions/asideAction'

import Icon from 'components/Icon'
import CustomTable from 'modules/CustomTable'
import Pagination from 'modules/Pagination'

const PlayersTable = ({ data }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [pagination, setPagination] = useState({
    page: 0,
    quantity: 10,
    results: data.length,
    pages: Math.ceil(data.length / 10),
  })

  const paginatedData = useMemo(() => {
    const start = pagination.page * pagination.quantity
    return data.slice(start, start + pagination.quantity)
  }, [data, pagination])

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      results: data.length,
      pages: Math.ceil(data.length / prev.quantity),
      page: Math.min(prev.page, Math.ceil(data.length / prev.quantity) - 1),
    }))
  }, [])

  const nextHandleSubmit = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.pages - 1),
    }))
  }
  const prevHandleSubmit = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 0),
    }))
  }
  const startHandlerSubmit = () => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
    }))
  }
  const endHandlerSubmit = () => {
    setPagination((prev) => ({
      ...prev,
      page: prev.pages - 1,
    }))
  }

  const handleDeposit= (e, type) => {
    dispatch(
      setAside({
        meta: {
          title: t('deposit_balance'),
          cmd: 'account-deposit-balance',
          buttonRef: e.target,
        },
        type: type,
        ...data,
      }),
    )
  }

  const handleWithdrawal = (e, type) => {
    dispatch(
      setAside({
        meta: {
          title: t('withdrawal_balance'),
          cmd: 'account-withdrawal-balance',
          buttonRef: e.target,
        },
        type: type,
        ...data,
      }),
    )
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'agent', label: 'Agent' },
    { key: 'shop', label: 'Shop' },
    { key: 'username', label: 'Username' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'balance',
      label: 'Balance',
      sortable: true,
      render: (user) => (
        <>
          <Icon icon="fa-minus" alt="Withdrawal" action={e => handleWithdrawal(e, types.TYPE[4])} />
          {parseFloat(user.balance).toFixed(2)}
          <Icon icon="fa-plus" alt="Deposit" action={e => handleDeposit(e, types.TYPE[5])} />
        </>
      )
    },
    { key: 'currency', label: 'Currency' },
    { key: 'createdAt', label: 'Created at' },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <Icon icon="fa-eye" alt="View" action={() => console.log('View', user)} />
      ),
    },
  ]

  return (
    <>
      <CustomTable data={paginatedData} columns={columns} defaultSortKey="id" />
      <Pagination
        position="bottom"
        pagination={pagination}
        nextHandler={nextHandleSubmit}
        prevHandler={prevHandleSubmit}
        startHandlerSubmit={startHandlerSubmit}
        endHandlerSubmit={endHandlerSubmit}
      />
    </>
  )
}

export default PlayersTable
