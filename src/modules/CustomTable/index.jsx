import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { getDate } from 'src/helpers/getDate'

import Loader from 'components/Loader'
import Sprite from 'components/Sprite'
import Pagination from 'modules/Pagination'

import style from './index.module.scss'

const getNestedValue = (obj, path) => {
  if (!obj || typeof obj !== 'object') return undefined
  return path.split('.').reduce((acc, key) => {
    return acc?.[key]
  }, obj)
}

const CustomTable = ({
  data,
  config,
  loading,
  handleSubmit,
  sort,
  handleSortChange
}) => {
  const { t } = useTranslation()

  const renderCell = (key, value, type, row) => {
    if (key.includes('.')) {
      value = getNestedValue(row, key)
      return (
        <div
          className={
            clsx(
              type === 'number' ? style.count : '',
              Number(value) < 0 ? style.down : style.up
            )
          }
        >
          {value}
        </div>
      )
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      value = Object.entries(value)
        .map(([k, v]) => `${v} ${k}`)
        .join(', ')
    }

    switch (type) {
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
      case 'number':
        return <p className={style.count}>{data}, {value}</p>
      default:
        return value ?? '-'
    }
  }

  const renderSortIcon = (key) => {
    if (sort.key !== key) {
      return <Sprite name="arrow-up-down" size="14" />
    }

    return sort.direction === 'asc'
      ? <Sprite name="arrow-up-wide-narrow" size="14" />
      : <Sprite name="arrow-down-wide-narrow" size="14" />
  }

  return (
    <div className={style.block}>
      {
        loading && <Loader type={'content'} />
      }
      <Pagination
        position="top"
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
                  clsx(
                    style.cell,
                    sorted ? style.pointer : style.default
                  )
                }
                onClick={() => handleSortChange(key, sorted)}
              >
                <span>{t(text)}</span>
                {
                  sorted &&
                  renderSortIcon(key)
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
                    config.map(({ key, type }) =>
                      <div
                        key={key}
                        className={style.cell}
                      >
                        {renderCell(key, el[key], type, el)}
                      </div>
                    )
                  }
                </div>
              )
        }
      </div>
      <Pagination
        position="bottom"
        pagination={data.pagination}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default CustomTable
