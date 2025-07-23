import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { NAVIGATION, service } from 'constant/config'
import { getDate } from 'helpers/getDate'

import Icon from 'components/Icon'
import ReadMore from 'modules/ReadMore'

import style from './index.module.scss'

const Table = ({ data, config, sort, handleSortChange }) => {
  const { t } = useTranslation()

  const renderCell = (key, row) => {
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
      <Icon icon="fa-pencil" alt="edit" />
      <Icon icon="fa-lock" alt="locked" />
      <Icon icon="fa-trash" alt="delete" />
    </>
  )

  const renderLink = (label, value, url) => (
    <>
      <Icon icon="fa-add" alt="add" />
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
        <div className={style.cell}>{t('shops')}</div>
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
                    <div key={key} className={style.cell}>
                      {renderCell(key, row)}
                    </div>
                  )
                }
                <div className={style.cell}>{renderActions()}</div>
                <div className={style.cell}>{renderLink('shops', row.shops, `${NAVIGATION.shops.link}/${row.id}`)}</div>
                <div className={style.cell}>{renderLink('cashiers', row.cashiers, `${NAVIGATION.cashiers.link}/${row.id}`)}</div>
                <div className={style.cell}>{renderLink('players', row.players, `${NAVIGATION.players.link}/${row.id}`)}</div>
              </div>
            )
          :
            <div className={style.empty}>{t('no_matching_records_found')}</div>
      }
    </div>
  )
}

export default Table
