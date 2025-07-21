import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { service } from 'constant/config'
import { getDate } from 'helpers/getDate'

import Icon from 'components/Icon'
import ReadMore from 'modules/ReadMore'

import style from './index.module.scss'

const Table = ({ data, config }) => {
  const { t } = useTranslation()
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

  const handleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else {
      setSortKey(null)
      setSortOrder('asc')
    }
  }

  const sortedData = useMemo(() => {
    if (!sortKey) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal == null) return 1
      if (bVal == null) return -1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }

      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [data, sortKey, sortOrder])

  const renderCell = (key, row) => {
    if (key.indexOf('.') !== -1) {
      const keys = key.split('.');
      return keys.reduce((acc, k) => acc?.[k], row)
    }

    const value = row[key]
    switch (key) {
      case 'locked':
        return service.YES_NO[value]
      case 'date_created':
        return getDate(value, 'datetime')
      case 'credits':
        return value
          ?
            <div>
              <ReadMore data={value} />
              <div className={style.actions}>
                <Icon
                  classes={[
                    style.icon,
                    style.deposit
                  ]}
                  icon="fa-plus"
                  alt="deposit"
                />
                <Icon
                  classes={[
                    style.icon,
                    style.withdraw
                  ]}
                  icon="fa-minus"
                  alt="withdraw"
                />
              </div>
            </div>
          :
            null
      default:
        return value
    }
  }

  const renderActions = () => (
    <>
      <Icon icon="fa-info-circle" alt="info" />
      <Icon icon="fa-pencil" alt="edit" />
      <Icon icon="fa-lock" alt="locked" />
      <Icon icon="fa-trash" alt="delete" />
    </>
  )

  return (
    <div className={style.block}>
      <div className={style.row}>
        {
          config.map(({ key, text, sorted }) =>
            <div
              key={key}
              className={style.cell}
              onClick={() => handleSort(key)}
            >
              <span>{t(text)}</span>
              {
                sorted &&
                <FontAwesomeIcon
                  className={style.sort}
                  icon={`fa-solid ${
                    sortKey === key
                      ? sortOrder === 'asc'
                        ? 'fa-arrow-up-wide-short'
                        : 'fa-arrow-down-wide-short'
                      : 'fa-sort'
                  }`}
                />
              }
            </div>
          )
        }
        <div className={style.cell}>{t('actions')}</div>
      </div>

      {
        sortedData.length > 0
          ?
            sortedData.map((row, idx) =>
              <div
                key={idx}
                className={style.row}
              >
                {
                  config.map(({ key }) =>
                    <div
                      key={key}
                      className={style.cell}
                    >
                      {renderCell(key, row)}
                    </div>
                  )
                }
                <div className={style.cell}>{renderActions()}</div>
              </div>
            )
          :
            <div className={style.empty}>{t('no_matching_records_found')}</div>
      }
    </div>
  )
}

export default Table
