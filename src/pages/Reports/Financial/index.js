import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ACCOUNT_TYPE, NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { useAuthStore } from 'stores/authStore'

import { useSort } from 'hooks/useSort'
import { useFilterState } from 'hooks/useFilterState'
import { getDate } from 'helpers/getDate'
import { buildFormData } from 'helpers/buildFormData'

import Debug from 'modules/Debug'
import Button from 'components/Button'
import Paper from 'components/Paper'
import Field from 'components/Field'
import Tab from 'components/Tab'
import CustomSelect from 'components/Select'
import CustomTable from 'modules/CustomTable'

import style from './index.module.scss'

const CONFIG = {
  detailed: [
    { key: 'id', text: 'id' },
    { key: 'date', text: 'date', type: 'datetime' },
    { key: 'agent.username', text: 'agent_from' },
    { key: 'shop.username', text: 'shop_to' },
    { key: 'transaction', text: 'transaction' },
    { key: 'amount', text: 'amount' },
    { key: 'currency', text: 'currency' },
  ],

  currency: [
    // { key: 'period', text: 'period', data: 'period' },
    { key: 'currency', text: 'currency' },
    { key: 'credits.in', text: 'in' },
    { key: 'credits.out', text: 'out' },
    { key: 'credits.voucher_in', text: 'voucher_in' },
    { key: 'credits.voucher_out', text: 'voucher_out' },
    { key: 'credits.revenue', text: 'revenue', type: 'number', sorted: true },
  ],

  shops: [
    // { key: 'period', text: 'period', data: 'period' },
    { key: 'agent.username', text: 'agent' },
    { key: 'shop.username', text: 'shop' },
    { key: 'currency', text: 'currency' },
    { key: 'credits.in', text: 'in' },
    { key: 'credits.out', text: 'out' },
    { key: 'credits.voucher_in', text: 'voucher_in' },
    { key: 'credits.voucher_out', text: 'voucher_out' },
    { key: 'credits.revenue', text: 'revenue', type: 'number', sorted: true }
  ],

  players: [
    // { key: 'period', text: 'period', type: 'period' },
    { key: 'agent.username', text: 'agent' },
    { key: 'player.username', text: 'player' },
    { key: 'currency', text: 'currency' },
    { key: 'credits.in', text: 'in' },
    { key: 'credits.out', text: 'out' },
    { key: 'credits.bonus_in', text: 'bonus_in' },
    { key: 'credits.bonus_out', text: 'bonus_out' },
    { key: 'credits.revenue', text: 'revenue', type: 'number', sorted: true },
  ],

  cashiers: [
    { key: 'shift_id', text: 'shift_id' },
    { key: 'period', text: 'period', type: 'period' },
    { key: 'start_balance', text: 'start_balance' },
    { key: 'end_balance', text: 'end_balance' },
    { key: 'agent.username', text: 'agent' },
    { key: 'shop.username', text: 'shop' },
    { key: 'cashier.username', text: 'cashier' },
    { key: 'currency', text: 'currency' },
    { key: 'credits.voucher_in', text: 'voucher_in' },
    { key: 'credits.voucher_out', text: 'voucher_out' },
    { key: 'credits.in', text: 'in' },
    { key: 'credits.out', text: 'out' },
    { key: 'credits.bonus_in', text: 'bonus_in' },
    { key: 'credits.bonus_out', text: 'bonus_out' },
    { key: 'credits.revenue', text: 'revenue', type: 'number', sorted: true },
  ],

  vouchers: [
    { key: 'agent.username', text: 'agent' },
    { key: 'shop.username', text: 'shop' },
    { key: 'cashier.username', text: 'cashier' },
    { key: 'currency', text: 'currency' },
    { key: 'code', text: 'code' },
    { key: 'amount', text: 'amount' },
    { key: 'type', text: 'type' },
    { key: 'created', text: 'created', type: 'datetime' },
    { key: 'used', text: 'used', type: 'datetime' },
  ],
}

const OPTIONS = {
  '0': 'detailed',
  '1': 'currency',
  '2': 'shops',
  '3': 'players',
  '4': 'cashiers',
  '5': 'vouchers'
}

const INITIAL_FILTER = {
  'agent': -1,
  'shop': -1,
  'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
  'date-to': getDate(new Date(), 'datetime-local'),
}

const INITIAL_SORT = { key: null, direction: null }


const Financial = () => {
  const { t } = useTranslation()
  const { auth} = useAuthStore()
  const { request, loading } = useApi()

  const [active, setActive] = useState('0')
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(20)

  const TABS = auth?.role === ACCOUNT_TYPE.CASHIER
    ?
      {
       '0': OPTIONS['4'],
       '1': OPTIONS['5']
      }
    :
      OPTIONS

  const handleSubmit = async (e, page = 0, nextFilter = filter, nextSort = sort) => {
    e && e.preventDefault()

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      agent: nextFilter.agent,
      shop: nextFilter.shop,
      'date-from': nextFilter['date-from'],
      'date-to': nextFilter['date-to'],
    })

    if (nextSort.direction) {
      formData.append('sort_key', nextSort.key)
      formData.append('sort_direction', nextSort.direction)
    }

    setData(await request(REQUEST_TYPE.POST, `reports/financial/${TABS[active]}/`, formData))
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)
  const { sort, setSort, handleSortChange } = useSort(INITIAL_SORT, handleSubmit, filter)

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  const { options: shopsOptions } = useOptions(
    `shops_tree/${filter.agent}`,
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }],
    Boolean(filter.agent)
  )

  useEffect(() => {
    setSort(INITIAL_SORT)
    handleSubmit(null, 0, INITIAL_FILTER, INITIAL_SORT)
  }, [quantity, active])

  return (
    <div className={style.block}>
      <Paper
        headline={t(NAVIGATION.reports.financial.text)}
        classes={['sm']}
        quantity={quantity}
        setQuantity={setQuantity}
      >
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.filter}>
            {
              (
                auth?.role === ACCOUNT_TYPE.ADMIN ||
                auth?.role === ACCOUNT_TYPE.AGENT
              ) &&
              <>
                <CustomSelect
                  placeholder={t('agent')}
                  options={agentsOptions}
                  data={filter.agent}
                  onChange={value => handlePropsChange('agent', value)}
                />
                {
                  filter.agent !== -1 &&
                  <CustomSelect
                    placeholder={t('shop')}
                    options={shopsOptions}
                    data={filter.shop}
                    onChange={value => handlePropsChange('shop', value)}
                  />
                }
              </>
            }
            <Field
              type='datetime-local'
              placeholder={t('date_from')}
              data={filter['date-from']}
              onChange={value => handlePropsChange('date-from', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('date_to')}
              data={filter['date-to']}
              onChange={value => handlePropsChange('date-to', value)}
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
              onChange={() => {
                setFilter(INITIAL_FILTER)
                setSort(INITIAL_SORT)
                handleSubmit(null, 0, INITIAL_FILTER, INITIAL_SORT)
              }}
            />
          </div>
        </form>
      </Paper>

      <Paper>
        <Tab
          data={active}
          action={setActive}
          options={Object.entries(TABS)}
        />
        <br/>
        <CustomTable
          data={data}
          config={CONFIG[TABS[active]]}
          loading={loading}
          handleSubmit={handleSubmit}
          sort={sort}
          handleSortChange={handleSortChange}
        />
      </Paper>
    </div>
  )
}

export default Financial
