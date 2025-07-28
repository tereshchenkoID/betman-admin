import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux";
import { setAside } from 'store/actions/asideAction'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { NAVIGATION, service } from 'constant/config'
import { getDate } from 'helpers/getDate'

import Icon from 'components/Icon'
import ReadMore from 'modules/ReadMore'

import style from './index.module.scss'

const Table = ({ data, config, sort, handleSortChange }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleDeposit= (e, type) => {
    dispatch(
      setAside({
        meta: {
          title: t('deposit'),
          cmd: 'account-deposit',
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
          title: t('withdrawal'),
          cmd: 'account-withdrawal',
          buttonRef: e.target,
        },
        type: type,
        ...data,
      }),
    )
  }

  const handlePlayer = (e, type) => {
    dispatch(
      setAside({
        meta: {
          title: t('player'),
          cmd: 'account-player',
          buttonRef: e.target,
        },
        type: type,
        ...data,
      }),
    )
  }

  const handleCashier = (e, type) => {
    dispatch(
      setAside({
        meta: {
          title: t('new_cashier'),
          cmd: 'account-cashier',
          buttonRef: e.target,
        },
        type: type,
        ...data,
      }),
    )
  }

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
                  action={e => handleDeposit(e, service.TYPE[0])}
                />
                <Icon
                  classes={[
                    style.icon,
                    style.withdraw
                  ]}
                  icon="fa-minus"
                  alt="withdraw"
                  action={e => handleWithdrawal(e, service.TYPE[1])}
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
      <Icon icon="fa-pencil" alt="edit" />
      <Icon icon="fa-lock" alt="locked" />
      <Icon icon="fa-trash" alt="delete" />
    </>
  )

  const renderLink = (label, value, url, handleAction, type) => (
    <>
      <Icon
        icon="fa-add"
        alt="add"
        action={e => handleAction(e, service.TYPE[type])}
      />
      <Link
        to={url}
        rel="noreferrer"
        className={style.link}
      >
        {value}
      </Link>
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
        <div className={style.cell}>{t('actions')}</div>
        <div className={style.cell}>{t('cashiers')}</div>
        <div className={style.cell}>{t('players')}</div>
      </div>
      {
        data.length > 0
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
                <div className={style.cell}>{renderActions()}</div>
                <div className={style.cell}>{renderLink('cashiers', row.cashiers, `${NAVIGATION.cashiers.link}/${row.agent.id}/${row.id}`, handleCashier, 4)}</div>
                <div className={style.cell}>{renderLink('players', row.players, `${NAVIGATION.players.link}/${row.agent.id}/${row.id}`, handlePlayer, 3)}</div>
              </div>
            )
          :
            <div className={style.empty}>{t('no_matching_records_found')}</div>
      }
    </div>
  )
}

export default Table
