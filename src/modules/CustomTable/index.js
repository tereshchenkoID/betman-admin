import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

import { getDate } from 'helpers/getDate'

import classNames from 'classnames'

import Pagination from 'modules/Pagination'
import Loader from 'components/Loader'

import style from './index.module.scss'

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

  return (
    <div className={style.block}>
      {
        loading
          ?
            <Loader type={'block'} />
          :
            <>
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
                            sorted && style.pointer
                          )
                        }
                        onClick={() => handleSortChange(key)}
                      >
                        <span>{text}</span>
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
                          {t('no_matching_records_found')}
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
                                {
                                  data
                                    ?
                                      getDate(el[key], data)
                                    :
                                      el[key]
                                }
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
            </>
      }
    </div>
  )
}

export default CustomTable
