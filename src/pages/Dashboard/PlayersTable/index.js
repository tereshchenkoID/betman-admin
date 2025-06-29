import React, { useState, useMemo } from 'react'
import Icon from 'components/Icon'
import CustomTable from 'modules/CustomTable'
import Pagination from 'modules/Pagination'

const PlayersTable = ({ data }) => {
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

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      results: data.length,
      pages: Math.ceil(data.length / prev.quantity),
      page: Math.min(prev.page, Math.ceil(data.length / prev.quantity) - 1),
    }))
  }, [data])

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
      render: (user) => parseFloat(user.balance).toFixed(2),
    },
    { key: 'currency', label: 'Currency' },
    { key: 'createdAt', label: 'Created at' },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <>
          <Icon icon="fa-eye" alt="View" action={() => console.log('View', user)} />
          <Icon icon="fa-arrow-down" alt="Deposit" action={() => console.log('Deposit', user)} />
          <Icon icon="fa-arrow-up" alt="Withdrawal" action={() => console.log('Withdraw', user)} />
        </>
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
