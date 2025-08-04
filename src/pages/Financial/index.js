import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getDate } from 'helpers/getDate'
import { getData } from 'hooks/useRequest'

import Debug from 'modules/Debug'
import Button from 'components/Button'
import Paper from 'components/Paper'
import Field from 'components/Field'
import CustomSelect from 'components/Select'
import CustomTable from 'modules/CustomTable'

import style from './index.module.scss'

const CONFIG = [
  { key: 'id', text: 'id', sorted: true },
  { key: 'datetime', text: 'date_hour', data: 'datetime' },
  { key: 'agent', text: 'agent' },
  { key: 'store', text: 'store' },
  { key: 'user', text: 'user' },
  { key: 'player', text: 'player' },
  { key: 'type', text: 'type_transaction' },
  { key: 'sum', text: 'sum' },
  { key: 'currency', text: 'currency' },
  { key: 'balance_after', text: 'balance_after', sorted: true },
  { key: 'bonus_after', text: 'bonus_after', sorted: true },
]

const Financial = () => {
  const { t } = useTranslation()
  const initialValue = {
    'player': '',
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

    // TODO Update after api on postData
    getData(`${window.location.origin}/json/financial.json`).then(json => {
      if (json.code === '0') {
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
        headline={t('financial_report')}
        classes={['sm']}
        quantity={quantity}
        setQuantity={setQuantity}
      >
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.filter}>
            <div>
              <CustomSelect
                placeholder={t('player')}
                options={[
                  { label: 'Agent X', value: 'Agent X' },
                  { label: 'Agent Y', value: 'Agent Y' },
                ]}
                data={filter.provider}
                onChange={value => handlePropsChange('player', value)}
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
              classes={'primary'}
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

export default Financial
