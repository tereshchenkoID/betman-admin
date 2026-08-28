import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ACCESS_TYPE,
  NAVIGATION,
  REQUEST_TYPE,
  VERIFICATION_TYPE,
  RISK_TYPE,
  service, ACCOUNT_LEVEl
} from 'src/constant/config'

import { useAsideStore } from 'src/stores/asideStore'
import { useSettingsStore } from 'src/stores/settingsStore'
import { useCmdStore } from 'src/stores/cmdStore'
import { useAuthStore } from 'src/stores/authStore'

import { useApi } from 'src/hooks/useApi'
import { useSort } from 'src/hooks/useSort'
import { useFilterState } from 'src/hooks/useFilterState'
import { getDate } from 'src/helpers/getDate'
import { buildFormData } from 'src/helpers/buildFormData'
import { convertOptions } from 'src/helpers/convertOptions'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Loader from 'components/Loader'
import CustomSelect from 'components/Select'
import Debug from 'modules/Debug'
import Pagination from 'modules/Pagination'
import Table from './Table'

import style from './index.module.scss'

const CONFIG = [
  { key: 'id', text: 'id', sorted: true },
  { key: 'username', text: 'username' },
  { key: 'full_name', text: 'full_name' },
  { key: 'phone', text: 'phone' },
  { key: 'email', text: 'email' },
  { key: 'access', text: 'access', sorted: true },
  { key: 'credits', text: 'credits' },
  { key: 'bonuses', text: 'bonuses' },
  { key: 'currency', text: 'currency', sorted: true },
  { key: 'date_created', text: 'date_created', sorted: true },
  { key: 'kyc', text: 'kyc', sorted: true },
  { key: 'risk_level', text: 'risk', sorted: true },
  { key: 'date_last_stake', text: 'date_last_stake' },
  { key: 'average_rate', text: 'average_rate' },
  { key: 'total_deposit', text: 'total_deposit' },
  { key: 'total_withdrawal', text: 'total_withdrawal' },
  { key: 'registration_source', text: 'registration_source', sorted: true },
  { key: 'affiliate_id', text: 'affiliate_id' },
  { key: 'turnover', text: 'turnover' },
  { key: 'rtp', text: 'rtp' },
]

const Players = () => {
  const { t } = useTranslation()
  const { settings } = useSettingsStore()
  const { request, loading } = useApi()
  const { auth } = useAuthStore()
  const { setAside } = useAsideStore()
  const { cmd, setCmd } = useCmdStore()

  const INITIAL_FILTER = {
    q: '',
    access: -1,
    currency: -1,
    verification: -1,
    risk_level: -1,
    last_stake_from: getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    last_stake_to: getDate(new Date(), 'datetime-local'),
    last_deposit_from: getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    last_deposit_to: getDate(new Date(), 'datetime-local'),
  }
  const INITIAL_SORT = { key: null, direction: null }

  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(service.QUANTITY[20])

  const handleSubmit = async (e, page = 0, nextFilter = filter, nextSort = sort) => {
    e && e.preventDefault()

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      access: nextFilter.locked,
      currency: nextFilter.currency,
      verification: nextFilter.verification,
      risk_level: nextFilter.risk_level,
      last_stake_from: nextFilter.last_stake_from,
      last_stake_to: nextFilter.last_stake_to,
      last_deposit_from: nextFilter.last_deposit_from,
      last_deposit_to: nextFilter.last_deposit_to,
    })

    if (nextSort.direction) {
      formData.append('sort_key', nextSort.key)
      formData.append('sort_direction', nextSort.direction)
    }

    setData(await request(REQUEST_TYPE.POST, 'players/', formData))
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)
  const { sort, setSort, handleSortChange } = useSort(INITIAL_SORT, handleSubmit, filter)

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
    setSort(INITIAL_SORT)
    handleSubmit(null, 0, INITIAL_FILTER, INITIAL_SORT)
  }

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  useEffect(() => {
    if (cmd === 'refresh-table') {
      handleSubmit(null, data?.pagination?.page, filter, sort);
      setCmd(null)
    }
  }, [cmd])

  return (
    <>
      <Paper
        headline={t(NAVIGATION.players.text)}
        classes={['sm']}
        quantity={quantity}
        setQuantity={setQuantity}
      >
        <Debug data={{...filter, ...sort}} />
        <form onSubmit={handleSubmit}>
          <div className={style.grid}>
            <Field
              type='text'
              placeholder={t('id_username')}
              data={filter['q']}
              onChange={value => handlePropsChange('q', value)}
            />
            <CustomSelect
              placeholder={t('verification')}
              options={[
                { value: -1, label: t('select_from_list') },
                ...convertOptions(VERIFICATION_TYPE, t)
              ]}
              data={filter['verification']}
              onChange={value => handlePropsChange('verification', value)}
            />
            <CustomSelect
              placeholder={t('risk')}
              options={[
                { value: -1, label: t('select_from_list') },
                ...convertOptions(RISK_TYPE, t)
              ]}
              data={filter['risk_level']}
              onChange={value => handlePropsChange('risk_level', value)}
            />
            <CustomSelect
              placeholder={t('currency')}
              options={[
                { value: -1, label: t('select_from_list') },
                ...Object.entries(settings?.currencies).map(([key, el], index) => ({
                  value: key,
                  label: el.text
                }))
              ]}
              data={filter?.currency}
              onChange={value => handlePropsChange('currency', value)}
            />
            <CustomSelect
              placeholder={t('access')}
              options={[
                { value: -1, label: t('select_from_list') },
                ...convertOptions(ACCESS_TYPE, t)
              ]}
              data={filter['access']}
              onChange={value => handlePropsChange('access', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('last_stake_from')}
              data={filter['last_stake_from']}
              onChange={value => handlePropsChange('last_stake_from', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('last_stake_to')}
              data={filter['last_stake_to']}
              onChange={value => handlePropsChange('last_stake_to', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('last_deposit_from')}
              data={filter['last_deposit_from']}
              onChange={value => handlePropsChange('last_deposit_from', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('last_deposit_to')}
              data={filter['last_deposit_to']}
              onChange={value => handlePropsChange('last_deposit_to', value)}
            />
          </div>
          <div className={style.actions}>
            <Button
              type={'submit'}
              classes={['primary']}
              placeholder={t('search')}
            />
            <Button
              type={'reset'}
              placeholder={t('cancel')}
              onChange={handleResetForm}
            />
          </div>
          {
            (
              auth?.role === ACCOUNT_LEVEl.ADMIN ||
              auth?.role === ACCOUNT_LEVEl.MANAGER ||
              auth?.role === ACCOUNT_LEVEl.SUPPORT
            ) &&
            <div className={style.actions}>
              <Button
                classes={['primary']}
                placeholder={t('add_player')}
                onChange={(e) => {
                  setAside({
                    meta: {
                      title: t('add_player'),
                      cmd: 'player-add',
                      buttonRef: e.target,
                    }
                  })
                }}
              />
            </div>
          }
        </form>
      </Paper>
      <Paper classes={[style.paper]}>
        {
          loading &&
          <Loader type={'loading'} />
        }
        <Pagination
          position='top'
          pagination={data.pagination}
          handleSubmit={handleSubmit}
        />
        {
          data?.code &&
          <div className={style.table}>
            <Table
              data={data.data}
              config={CONFIG}
              sort={sort}
              handleSortChange={handleSortChange}
            />
          </div>
        }
        <Pagination
          position='bottom'
          pagination={data.pagination}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </>
  )
}

export default Players
