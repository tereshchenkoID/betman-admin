import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ACCOUNT_TYPE, NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { useAuth } from 'hooks/useAuth'
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
    { key: 'id', text: 'id', sorted: true },
    { key: 'date', text: 'date', data: 'datetime' },
    { key: 'agent.username', text: 'agent_from' },
    { key: 'shop.username', text: 'shop_to' },
    { key: 'transaction', text: 'transaction', data: 'transaction' },
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
    { key: 'credits.revenue', text: 'revenue' },
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
    { key: 'credits.revenue', text: 'revenue' }
  ],

  players: [
    // { key: 'period', text: 'period', data: 'period' },
    { key: 'agent.username', text: 'agent' },
    { key: 'player.username', text: 'player' },
    { key: 'currency', text: 'currency' },
    { key: 'credits.in', text: 'in' },
    { key: 'credits.out', text: 'out' },
    { key: 'credits.bonus_in', text: 'bonus_in' },
    { key: 'credits.bonus_out', text: 'bonus_out' },
    { key: 'credits.revenue', text: 'revenue' },
  ],

  cashiers: [
    { key: 'shift_id', text: 'shift_id' },
    { key: 'period', text: 'period', data: 'period' },
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
    { key: 'credits.revenue', text: 'revenue' },
  ],

  vouchers: [
    { key: 'agent.username', text: 'agent' },
    { key: 'shop.username', text: 'shop' },
    { key: 'cashier.username', text: 'cashier' },
    { key: 'currency', text: 'currency' },
    { key: 'code', text: 'code' },
    { key: 'amount', text: 'amount' },
    { key: 'type', text: 'type' },
    { key: 'created', text: 'created', data: 'datetime' },
    { key: 'used', text: 'used', data: 'datetime' },
  ],
}

const INITIAL_FILTER = {
  'agent': -1,
  'shop': -1,
  'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
  'date-to': getDate(new Date(), 'datetime-local'),
}

const OPTIONS = {
  '0': 'detailed',
  '1': 'currency',
  '2': 'shops',
  '3': 'players',
  '4': 'cashiers',
  '5': 'vouchers'
}

const Financial = () => {
  const { t } = useTranslation()
  const { auth } = useAuth()
  const { request, loading } = useApi()
  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

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

  const handleSubmit = async (e, page = 0, nextFilter = filter) => {
    e && e.preventDefault()

    // const formData = buildFormData(nextFilter)

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      agent: nextFilter.agent,
      shop: nextFilter.shop,
      'date-from': nextFilter['date-from'],
      'date-to': nextFilter['date-to'],
    })

    setData(await request(REQUEST_TYPE.POST, `reports/financial/${TABS[active]}/`, formData))
  }

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
    handleSubmit()
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
                handleSubmit(null, INITIAL_FILTER)
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
        />
      </Paper>
    </div>
  )
}

export default Financial
