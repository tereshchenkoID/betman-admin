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
    { key: 'agent.username', text: 'agent' },
    { key: 'shop.username', text: 'shop' },
    { key: 'cashier.username', text: 'cashier' },
    { key: 'transaction', text: 'transaction', data: 'transaction' },
    { key: 'amount', text: 'amount' },
    { key: 'currency', text: 'currency' },
  ],

  currency: [
    { key: 'period', text: 'period', data: 'period' },
    { key: 'currency', text: 'currency' },
    { key: 'credits.in', text: 'in' },
    { key: 'credits.out', text: 'out' },
    { key: 'credits.voucher', text: 'voucher' },
    { key: 'credits.revenue', text: 'revenue' },
  ],

  shops: [
    { key: 'period', text: 'period', data: 'period' },
    { key: 'agent.username', text: 'agent' },
    { key: 'shop.username', text: 'shop' },
    { key: 'currency', text: 'currency' },
    { key: 'credits.in', text: 'in' },
    { key: 'credits.out', text: 'out' },
    { key: 'credits.voucher', text: 'voucher' },
    { key: 'credits.revenue', text: 'revenue' },
  ],

  players: [
    { key: 'period', text: 'period', data: 'period' },
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
    { key: 'period', text: 'period', data: 'period' },
    { key: 'agent.username', text: 'agent' },
    { key: 'shop.username', text: 'shop' },
    { key: 'cashier.username', text: 'cashier' },
    { key: 'currency', text: 'currency' },
    { key: 'credits.in', text: 'in' },
    { key: 'credits.out', text: 'out' },
    { key: 'credits.bonus_in', text: 'bonus_in' },
    { key: 'credits.bonus_out', text: 'bonus_out' },
    { key: 'credits.revenue', text: 'revenue' },
  ],
}

const TABS = {
  '0': 'detailed',
  '1': 'currency',
  '2': 'shops',
  '3': 'players',
  '4': 'cashiers'
}

const INITIAL_FILTER = {
  'agent': -1,
  'shop': -1,
  'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
  'date-to': getDate(new Date(), 'datetime-local'),
}

const Financial = () => {
  const { t } = useTranslation()
  const { auth } = useAuth()
  const { request, loading } = useApi()
  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const [active, setActive] = useState('0')
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(20)

  const handleSubmit = async (e, nextFilter = filter) => {
    e && e.preventDefault()

    const formData = buildFormData(nextFilter)
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
