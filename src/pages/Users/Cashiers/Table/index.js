import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { getDate } from 'helpers/getDate'
import { buildFormData } from 'helpers/buildFormData'
import { setCmd } from 'store/actions/cmdAction'
import { setAside } from 'store/actions/asideAction'

import Icon from 'components/Icon'
import ReadMore from 'modules/ReadMore'
import Tree from 'modules/Tree'

import style from './index.module.scss'

const Table = ({ data, config, sort, handleSortChange }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { request } = useApi()

  const handleDeposit = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('deposit'),
          cmd: 'account-deposit',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handleWithdrawal = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('withdrawal'),
          cmd: 'account-withdrawal',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handleEdit = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('edit'),
          cmd: 'account-cashier-edit',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const renderCell = (key, row) => {
    if (key.indexOf('agent') !== -1) {
      const keys = key.split('.');

      return <div className={style.wrapper}>
        {
          row.tree &&
          <Tree data={row} />
        }
        <p>{keys.reduce((acc, k) => acc?.[k], row)}</p>
      </div>
    }

    if (key.indexOf('.') !== -1) {
      const keys = key.split('.');

      return keys.reduce((acc, k) => acc?.[k], row)
    }

    const value = row[key]
    switch (key) {
      case 'date_created':
        return getDate(value, 'datetime')
      case 'credits':
        return value
          ?
            <div>
              {
                row.unlimited_balance === '1'
                  ?
                    t('unlimited')
                  :
                    <>
                      <ReadMore data={value} />
                      <div className={style.actions}>
                        <Icon
                          classes={['success']}
                          icon="fa-plus"
                          alt="deposit"
                          action={e => handleDeposit(e, row)}
                        />
                        <Icon
                          classes={['warning']}
                          icon="fa-minus"
                          alt="withdraw"
                          action={e => handleWithdrawal(e, row)}
                        />
                      </div>
                    </>
              }
            </div>
          :
            null
      default:
        return value || '-'
    }
  }

  const handleConfirmed = (e, row, onChange, title) => {
    dispatch(
      setAside({
        meta: {
          title: t(title),
          cmd: 'confirmed',
          buttonRef: e.target,
        },
        action: (result) => onChange(result, row),
      }),
    )
  }

  const handleLocked = async (e, row) => {
    if (e === 1) {
      const formData = buildFormData({ id: row.id, locked: row.locked === '1' ? '0' : '1' })
      await request(REQUEST_TYPE.POST, 'cashier/locked', formData)
    }
    dispatch(setCmd('refresh-table'))
    dispatch(setAside(null))
  }

  const handleDelete = async (e, row) => {
    if (e === 1) {
      const formData = buildFormData({ id: row.id })
      await request(REQUEST_TYPE.POST, 'cashier/delete', formData)
    }
    dispatch(setCmd('refresh-table'))
    dispatch(setAside(null))
  }

  const renderActions = (row) => (
    <>
      <Icon
        icon="fa-pencil"
        alt="edit"
        action={e => handleEdit(e, row)}
      />
      <Icon
        classes={['warning']}
        icon={`${row.locked === '0' ? 'fa-lock' : 'fa-lock-open'}`}
        alt={`${row.locked === '0' ? t('lock') : t('unlock')}`}
        action={e => handleConfirmed(e, row, handleLocked, 'notification.locked_confirmed')}
      />
      <Icon
        classes={['error']}
        icon="fa-trash"
        alt="delete"
        action={e => handleConfirmed(e, row, handleDelete, 'notification.delete_confirmed')}
      />
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
              onClick={() => handleSortChange(key, sorted)}
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
        <div className={style.cell}>{t('actions')}</div>
      </div>

      {
        data?.length > 0
          ?
            data.map((row, idx) =>
              <div
                key={idx}
                className={
                  classNames(
                    style.row,
                    row.locked === '1' && style.locked
                  )
                }
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
                <div className={style.cell}>{renderActions(row)}</div>
              </div>
            )
          :
            <div className={style.empty}>{t('notification.no_matching_records_found')}</div>
      }
    </div>
  )
}

export default Table
