import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import style from './index.module.scss'

const CustomTable = ({ data = [], columns = [], defaultSortKey = null }) => {
  const [sortConfig, setSortConfig] = useState({
    key: defaultSortKey,
    direction: 'asc',
  })

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]

    if (typeof aVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
    }

    return sortConfig.direction === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })

  const toggleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  return (
    <div className={style.block}>
      <div className={style.table}>
        <div className={style.row}>
          {
            columns.map(({ key, label, sortable }) => {
              const isSorted = sortConfig.key === key
              const isAsc = sortConfig.direction === 'asc'

              return (
                <div
                  key={key}
                  className={style.cell}
                  onClick={() => sortable && toggleSort(key)}
                  style={{ cursor: sortable ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>{label}</span>
                  {
                    sortable &&
                    <FontAwesomeIcon
                      className={style.sort}
                      icon={`fa-solid ${isSorted ? (isAsc ? 'fa-arrow-up-wide-short' : 'fa-arrow-down-wide-short') : 'fa-sort'}`}
                    />
                  }
                </div>
              )
            })
          }
        </div>

        {
          sortedData.length === 0
            ?
              <div className={style.row}>
                <div
                  className={style.cell}
                  style={{ gridColumn: `span ${columns.length}` }}
                >
                  No data found.
                </div>
              </div>
            :
              sortedData.map((row, idx) =>
                <div
                  key={idx}
                  className={style.row}
                >
                  {columns.map(({ key, render }) => (
                    <div key={key} className={style.cell}>
                      {render ? render(row) : row[key]}
                    </div>
                  ))}
                </div>
              )
        }
      </div>
    </div>
  )
}

export default CustomTable
