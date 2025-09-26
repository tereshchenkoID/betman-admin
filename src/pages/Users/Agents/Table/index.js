import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setAside } from 'store/actions/asideAction'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { NAVIGATION, REQUEST_TYPE, service } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { getDate } from 'helpers/getDate'
import { buildFormData } from 'helpers/buildFormData'

import Icon from 'components/Icon'
import Reference from 'components/Reference'
import ReadMore from 'modules/ReadMore'

import style from './index.module.scss'

const Table = ({ data, config, sort, handleSortChange }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { request } = useApi()

  const handleEditAgent = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('edit'),
          cmd: 'account-agent-edit',
          buttonRef: e.target,
        },
        id: row,
      }),
    )
  }

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

  const handleShop = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('shop'),
          cmd: 'account-shop',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handleAgent = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('agent'),
          cmd: 'account-agent',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handlePlayer = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('player'),
          cmd: 'account-player',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handleCashier = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('cashier'),
          cmd: 'account-cashier',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handleConfirmed = (e, id, onChange, title) => {
    dispatch(
      setAside({
        meta: {
          title: t(title),
          cmd: 'confirmed',
          buttonRef: e.target,
        },
        action: (result) => onChange(result, id),
      }),
    )
  }

  const handleLocked = async (e, id) => {
    if (e === 1) {
      const formData = buildFormData({ id: id })
      await request(REQUEST_TYPE.POST, 'agent/locked', formData)
    }
    dispatch(setAside(null))
  }

  const handleDelete = async (e, id) => {
    if (e === 1) {
      const formData = buildFormData({ id: id })
      await request(REQUEST_TYPE.POST, 'agent/delete', formData)
    }
    dispatch(setAside(null))
  }

  const renderCell = (key, row) => {
    const value = row[key]
    switch (key) {
      case 'locked':
        return t(service.YES_NO[value])
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
        return value
    }
  }

  const renderActions = (id) => (
    <>
      <Icon
        icon="fa-pencil"
        alt="edit"
        action={e => handleEditAgent(e, id)}
      />
      <Icon
        icon="fa-lock"
        alt="locked"
        action={e => handleConfirmed(e, id, handleLocked, 'notification.locked_confirmed')}
      />
      <Icon
        icon="fa-trash"
        alt="delete"
        action={e => handleConfirmed(e, id, handleDelete, 'notification.delete_confirmed')}
      />
    </>
  )

  const renderLink = (label, value, url, handleAction, type, row, isSmall = false ) => (
    <>
      {
        !isSmall &&
        <Icon
          icon="fa-add"
          alt="add"
          action={e => handleAction(e, row)}
        />
      }
      <Reference
        to={url}
        classes={['outline']}
        placeholder={value}
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
        <div className={style.cell}>{t('subagents')}</div>
        <div className={style.cell}>{t('shops')}</div>
        <div className={style.cell}>{t('cashiers')}</div>
        <div className={style.cell}>{t('players')}</div>
      </div>
      {
        data?.length > 0
          ?
            data.map((row, idx) =>
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
                <div className={style.cell}>{renderActions(row.id)}</div>
                <div className={style.cell}>
                  {
                    renderLink(
                      'subagents',
                      row.shops,
                      `${NAVIGATION.agents.link}/${row.id}`,
                      handleAgent,
                      2,
                      row,
                      row.create_subagents === '0'
                    )
                  }
                </div>
                <div className={style.cell}>{renderLink('shops', row.shops, `${NAVIGATION.shops.link}/${row.id}`, handleShop, 2, row)}</div>
                <div className={style.cell}>{renderLink('cashiers', row.cashiers, `${NAVIGATION.cashiers.link}/${row.id}`, handleCashier, 4, row)}</div>
                <div className={style.cell}>{renderLink('players', row.players, `${NAVIGATION.players.link}/${row.id}`, handlePlayer, 3, row)}</div>
              </div>
            )
          :
            <div className={style.empty}>{t('notification.no_matching_records_found')}</div>
      }
    </div>
  )
}

export default Table
