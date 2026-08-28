import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'

import {
  ACCESS_TYPE,
  ACCOUNT_LEVEl,
  ACCOUNT_TYPE,
  REQUEST_TYPE
} from 'src/constant/config'

import { useAuthStore } from 'src/stores/authStore'
import { useAsideStore } from 'src/stores/asideStore'
import { useCmdStore } from 'src/stores/cmdStore'

import { useApi } from 'src/hooks/useApi'
import { getDate } from 'src/helpers/getDate'
import { buildFormData } from 'src/helpers/buildFormData'

import Icon from 'components/Icon'

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
        cmd: 'user-edit',
        buttonRef: e.target,
      },
      ...row
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
      await request(REQUEST_TYPE.POST, 'user/access', formData)
    }
    setCmd('refresh-table')
    setAside(null)
  }

  const handleDelete = async (e, row) => {
    if (e === 1) {
      const formData = buildFormData({ id: row.id })
      await request(REQUEST_TYPE.POST, 'user/delete', formData)
    }
    setCmd('refresh-table')
    setAside(null)
  }

  const renderCell = (key, row) => {
    const value = row[key]
    switch (key) {
      case 'date_created':
        return getDate(value, 'datetime')
      case 'access':
        return t(ACCESS_TYPE[value])
      case 'role':
        return t(`account_types.${ACCOUNT_TYPE[value]}`)
      default:
        return value || '-'
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
                    row.access === '0' && style.locked
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
                      auth?.role === ACCOUNT_LEVEl.MANAGER &&
                      row.role !== ACCOUNT_LEVEl.ADMIN
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
