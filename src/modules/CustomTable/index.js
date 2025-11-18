import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

import { getDate } from 'helpers/getDate'

import classNames from 'classnames'

import Pagination from 'modules/Pagination'
import Loader from 'components/Loader'

import style from './index.module.scss'

const getNestedValue = (obj, path) => {
  if (!obj || typeof obj !== 'object') return undefined
  return path.split('.').reduce((acc, key) => {
    return acc?.[key]
  }, obj)
}

const CustomTable = ({ data, config, loading, handleSubmit }) => {
  const { t } = useTranslation()
  const [sort, setSort] = useState({
    key: null,
    direction: null,
  })

  const handleSortChange = (fieldName) => {
    setSort((prev) => {
      if (prev.key === fieldName) {
        const nextDirection =
          prev.direction === null
            ? 'asc'
            : prev.direction === 'asc'
              ? 'desc'
              : null;

        return {
          key: nextDirection ? fieldName : null,
          direction: nextDirection,
        };
      }

      return {
        key: fieldName,
        direction: 'asc',
      }
    })

    handleSubmit(null, 0)
  }

  const renderCell = (key, value, data, row) => {
    if (key.includes('.')) {
      return getNestedValue(row, key)
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      value = Object.entries(value)
        .map(([k, v]) => `${v} ${k}`)
        .join(', ')
    }

    switch (data) {
      case 'period':
        return (
          <div>
            {
              value?.map((v, i) =>
                <p key={i}>{getDate(v, 'datetime')}</p>
              )
            }
          </div>
        )
      case 'datetime':
        return getDate(value, 'datetime')
      case 'date':
        return getDate(value, 'date')
      default:
        return value ?? '-'
    }
  }

  return (
    <div className={style.block}>
      {
        loading && <Loader type={'content'} />
      }
      <Pagination
        position='top'
        pagination={data.pagination}
        handleSubmit={handleSubmit}
      />
      <div className={style.table}>
        <div className={style.row}>
          {
            config.map(({ key, text, sorted }) =>
              <div
                key={key}
                className={
                  classNames(
                    style.cell,
                    sorted ? style.pointer : style.default
                  )
                }
                onClick={() => handleSortChange(key)}
              >
                <span>{t(text)}</span>
                {
                  sorted &&
                  <FontAwesomeIcon
                    className={style.sort}
                    icon={`fa-solid ${
                      sort.key === key
                        ? sort.direction === 'asc'
                          ? 'fa-arrow-up-wide-short'
                          : 'fa-arrow-down-wide-short'
                        : 'fa-sort'
                    }`}
                  />
                }
              </div>
            )
          }
        </div>
        {
          data.data?.length === 0
            ?
              <div className={style.row}>
                <div
                  className={style.empty}
                  style={{ gridColumn: `span ${config.length}` }}
                >
                  {t('notification.no_matching_records_found')}
                </div>
              </div>
            :
              data.data?.map((el, idx) =>
                <div
                  key={idx}
                  className={style.row}
                >
                  {
                    config.map(({ key, data }) =>
                      <div
                        key={key}
                        className={style.cell}
                      >
                        {renderCell(key, el[key], data, el)}
                      </div>
                    )
                  }
                </div>
              )
        }
      </div>
      <Pagination
        position='bottom'
        pagination={data.pagination}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default CustomTable
