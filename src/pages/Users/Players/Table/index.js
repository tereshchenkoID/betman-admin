import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'

import {
  ACCOUNT_LEVEl,
  ACCESS_TYPE,
  REQUEST_TYPE,
  RISK_TYPE,
  VERIFICATION_TYPE
} from 'constant/config'

import { useAuthStore } from 'stores/authStore'
import { useAsideStore } from 'stores/asideStore'
import { useCmdStore } from 'stores/cmdStore'
import { useApi } from 'hooks/useApi'
import { getDate } from 'helpers/getDate'
import { buildFormData } from 'helpers/buildFormData'

import Icon from 'components/Icon'
import Scale from 'modules/Scale'

import style from './index.module.scss'

const Table = ({ data, config, sort, handleSortChange }) => {
  const { t } = useTranslation()
  const { request } = useApi()
  const { auth } = useAuthStore()
  const { setAside } = useAsideStore()
  const { setCmd } = useCmdStore()

  const handleEdit = (e, row) => {
    setAside({
      meta: {
        title: t('edit'),
        cmd: 'player-edit',
        buttonRef: e.target,
      },
      ...row,
    })
  }

  const handleConfirmed = (e, row, onChange, title) => {
    setAside({
      meta: {
        title: t(title),
        cmd: 'confirmed',
        buttonRef: e.target,
      },
      action: (result) => onChange(result, row),
    })
  }

  const handleLocked = async (e, row) => {
    if (e === 1) {
      const formData = buildFormData({ id: row.id, access: row.access === '1' ? '0' : '1' })
      await request(REQUEST_TYPE.POST, 'player/access', formData)
    }
    setCmd('refresh-table')
    setAside(null)
  }

  const handleDelete = async (e, row) => {
    if (e === 1) {
      const formData = buildFormData({ id: row.id })
      await request(REQUEST_TYPE.POST, 'player/delete', formData)
    }
    setCmd('refresh-table')
    setAside(null)
  }

  const renderCell = (key, row) => {
    const value = row[key]
    switch (key) {
      case 'date_created':
        return <p>{getDate(value, 'datetime')}</p>
      case 'date_last_stake':
        return <p>{getDate(value, 'datetime')}</p>
      case 'date_last_deposit':
        return <p>{getDate(value, 'datetime')}</p>
      case 'kyc':
        return <p
          className={
            clsx(
              style.value,
              style[VERIFICATION_TYPE[value]]
            )
          }
        >
          {t(VERIFICATION_TYPE[value])}
        </p>
      case 'risk_level':
        return <p>{t(RISK_TYPE[value])}</p>
      case 'access':
        return <p>{t(ACCESS_TYPE[value])}</p>
      case 'email':
        return <p
          className={
            clsx(
              style.value,
              style[VERIFICATION_TYPE[row.isVerifyEmail]]
            )
          }
        >
          {value}
        </p>
      case 'phone':
        return <p
          className={
            clsx(
              style.value,
              style[VERIFICATION_TYPE[row.isVerifyPhone]]
            )
          }
        >
          {value}
        </p>
      case 'bonuses':
        return  <>
          <p>{value?.amount}</p>
          {
            value.total_bets > 0 &&
            <Scale
              amount={value.total_bets}
              max={value.refund_sum}
              percentage={value.percentage}
            />
          }
        </>
      default:
        return <p>{value || '-'}</p>
    }
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
        icon={`${row.access === '0' ? 'fa-lock-open' : 'fa-lock'}`}
        alt={`${row.access === '0' ? "unlock" : "lock"}`}
        action={e => handleConfirmed(e, row, handleLocked, `notification.${row.access === '0' ? "unlocked_confirmed" : "locked_confirmed"}`)}
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
                  clsx(
                    style.row,
                    row.access === '0' && style.locked,
                    style[RISK_TYPE[row.risk_level]]
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
                <div className={style.cell}>
                  {
                    (
                      auth?.role === ACCOUNT_LEVEl.ADMIN ||
                      auth?.role === ACCOUNT_LEVEl.MANAGER ||
                      auth?.role === ACCOUNT_LEVEl.SUPPORT
                    )
                      ?
                        renderActions(row)
                      :
                        '-'
                  }
                </div>
              </div>
            )
          :
            <div className={style.empty}>{t('notification.no_matching_records_found')}</div>
      }
    </div>
  )
}

export default Table
