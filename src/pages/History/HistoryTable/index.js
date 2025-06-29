import React, { useEffect, useState, useMemo } from 'react'
import Icon from 'components/Icon'
import CustomTable from 'modules/CustomTable'
import Pagination from 'modules/Pagination'

const HistoryTable = ({ data }) => {
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

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'player', label: 'Players' },
    { key: 'provider', label: 'Provider' },
    { key: 'game', label: 'Game' },
    { key: 'startDate', label: 'Start date' },
    { key: 'bet', label: 'Bet' },
    { key: 'toWin', label: 'To win' },
    { key: 'profit', label: 'Profit' },
    { key: 'currency', label: 'Currency' },
    { key: 'action', label: 'Action' },
  ]

  return (
    <>
      <CustomTable data={paginatedData} columns={columns} />
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

export default HistoryTable
