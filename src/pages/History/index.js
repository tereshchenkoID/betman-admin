import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getDate } from 'helpers/getDate'
import { getData } from "helpers/api"

import Debug from 'modules/Debug'
import Button from 'components/Button'
import Paper from 'components/Paper'
import Field from 'components/Field'
import CustomSelect from "components/Select"
import CustomTable from "modules/CustomTable"

import style from './index.module.scss'

const CONFIG = [
  { key: 'id', text: 'id' },
  { key: 'player', text: 'players' },
  { key: 'provider', text: 'provider' },
  { key: 'game', text: 'game' },
  { key: 'start_date', text: 'start_date', data: 'datetime' },
  { key: 'bet', text: 'bet', sorted: true },
  { key: 'win', text: 'win', sorted: true },
  { key: 'profit', text: 'profit', sorted: true },
  { key: 'currency', text: 'currency' },
  { key: 'action', text: 'action' },
]

const History = () => {
  const { t } = useTranslation()
  const initialValue = {
    'player': '',
    'provider': '',
    'game': '',
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
    getData(`${window.location.origin}/json/history.json`).then(json => {
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
        headline={t('history_report')}
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
                data={filter.player}
                onChange={value => handlePropsChange('player', value)}
              />
            </div>
            <div>
              <CustomSelect
                placeholder={t('provider')}
                options={[
                  { label: 'Provider 1', value: 'provider 1' },
                  { label: 'Provider 2', value: 'provider 2' },
                ]}
                data={filter.provider}
                onChange={value => handlePropsChange('provider', value)}
              />
            </div>
            <div>
              <CustomSelect
                placeholder={t('game')}
                options={[
                  { label: 'Game 1', value: 'Game 1' },
                  { label: 'Game 2', value: 'Game 2' },
                ]}
                data={filter.game}
                onChange={value => handlePropsChange('game', value)}
              />
            </div>
            <div>
              <Field
                type="datetime-local"
                placeholder={t('date_from')}
                data={filter['date-from']}
                onChange={value => handlePropsChange('date-from', value)}
              />
            </div>
            <div>
              <Field
                type="datetime-local"
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

export default History
