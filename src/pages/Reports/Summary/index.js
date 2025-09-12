import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getDate } from 'helpers/getDate'
import { getData } from 'helpers/api'

import Button from 'components/Button'
import Paper from 'components/Paper'
import Field from 'components/Field'
import CustomSelect from 'components/Select'
import CustomTable from 'modules/CustomTable'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const CONFIG = [
  { key: 'currency', text: 'currency' },
  { key: 'provider', text: 'provider' },
  { key: 'profit', text: 'profit', sorted: true },
  { key: 'balance_profit', text: 'balance_profit', sorted: true },
  { key: 'bonus_profit', text: 'bonus_profit', sorted: true },
  { key: 'cash_profit', text: 'cash_profit', sorted: true },
  { key: 'profit_psp', text: 'profit_psp', sorted: true },
  { key: 'jackpot', text: 'jackpot', sorted: true },
  { key: 'spin', text: 'spin', sorted: true },
  { key: 'net_profit', text: 'net_profit', sorted: true },
]

const Summary = () => {
  const { t } = useTranslation()
  const initialValue = {
    'provider': '',
    'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
  }
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(20)
  const [filter, setFilter] = useState(initialValue)

  const handlePropsChange = (field, value) => {
    setFilter(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  const handleSubmit = event => {
    event && event.preventDefault()

    const formData = new FormData()
    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    getData(`${window.location.origin}/json/summary.json`).then(json => {
      if (json?.code === '0') {
        setData(json)
        setLoading(false)
      } else {
        console.error('Failed to load data:', data.message)
      }
    })
  }

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  return (
    <div className={style.block}>
      <Paper
        headline={t('summary_report')}
        classes={['sm']}
        quantity={quantity}
        setQuantity={setQuantity}
      >
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.filter}>
            <div>
              <CustomSelect
                placeholder={t('provider')}
                options={[
                  { label: 'Agent X', value: 'Agent X' },
                  { label: 'Agent Y', value: 'Agent Y' },
                ]}
                data={filter.provider}
                onChange={value => handlePropsChange('provider', value)}
              />
            </div>
            <div>
              <Field
                type='datetime-local'
                placeholder={t('date_from')}
                data={filter['date-from']}
                onChange={value => handlePropsChange('date-from', value)}
              />
            </div>
            <div>
              <Field
                type='datetime-local'
                placeholder={t('date_to')}
                data={filter['date-to']}
                onChange={value => handlePropsChange('date-to', value)}
              />
            </div>
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
        </form>
      </Paper>
      <CustomTable
        data={data}
        config={CONFIG}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default Summary
