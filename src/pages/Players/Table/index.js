import React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch } from "react-redux";
import { setAside } from 'store/actions/asideAction'

import { service } from 'constant/config'
import { getDate } from 'helpers/getDate'

import Icon from 'components/Icon'
import ReadMore from 'modules/ReadMore'

import style from './index.module.scss'

const Table = ({ data, config, sort, handleSortChange }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

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

  const handlePlayerInfo = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('player_details'),
          cmd: 'account-player-info',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handlePlayerEdit = (e, row) => {
    dispatch(
      setAside({
        meta: {
          title: t('player_edit'),
          cmd: 'account-player-edit',
          buttonRef: e.target,
        },
        ...row,
      }),
    )
  }

  const handleConfirmed = (e, onChange, title) => {
    dispatch(
      setAside({
        meta: {
          title: t(title),
          cmd: 'confirmed',
          buttonRef: e.target,
        },
        action: (result) => onChange(result),
      }),
    )
  }

  const handleLocked = (e) => {
    alert(`Locked ${e}`)
  }

  const handleDelete = (e) => {
    alert(`Delete ${e}`)
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
                  action={e => handleDeposit(e, row)}
                />
                <Icon
                  classes={[
                    style.icon,
                    style.withdraw
                  ]}
                  icon="fa-minus"
                  alt="withdraw"
                  action={e => handleWithdrawal(e, row)}
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
      <Icon
        icon="fa-info-circle"
        alt="info"
        action={e => handlePlayerInfo(e)}
      />
      <Icon
        icon="fa-pencil"
        alt="edit"
        action={e => handlePlayerEdit(e)}
      />
      <Icon
        icon="fa-lock"
        alt="locked"
        action={e => handleConfirmed(e, handleLocked, 'locked_confirmed')}
      />
      <Icon
        icon="fa-trash"
        alt="delete"
        action={e => handleConfirmed(e, handleDelete, 'delete_confirmed')}
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
              </div>
            )
          :
            <div className={style.empty}>{t('no_matching_records_found')}</div>
      }
    </div>
  )
}

export default Table
