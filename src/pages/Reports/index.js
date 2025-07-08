import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getDate } from 'helpers/getDate'

import Debug from 'modules/Debug'
import Button from 'components/Button'
import Paper from 'components/Paper'
import Field from 'components/Field'
import CustomSelect from "components/Select"
import SummaryTable from "./SummaryTable"

import style from './index.module.scss'

const DATA = [
  {
    currency: 'UAH',
    provider: 'Agent X',
    profit: '111',
    balanceProfit: '123.4',
    bonusProfit: '55',
    cashProfit: '222',
    profitPSP: '11.334',
    jackpot: '88',
    spin: '56',
    netProfit: '34',
  },
  {
    currency: 'EUR',
    provider: 'Agent Y',
    profit: '2222',
    balanceProfit: '289.6',
    bonusProfit: '111',
    cashProfit: '123.22',
    profitPSP: '111',
    jackpot: '23.11',
    spin: '111',
    netProfit: '1.11',
  },
];

const Reports = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState({
    provider: '',
    'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
  })

  const providerOptions = [
    { label: 'Agent X', value: 'Agent X' },
    { label: 'Agent Y', value: 'Agent Y' },
  ]

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }))
  }

  const handlePropsChange = (field, value) => {
    setFilter(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = event => {
    event && event.preventDefault()
    // const formData = new FormData()
    //
    // formData.append('playerID', filter.playerID)
    //
    // postData('dashboard/', formData).then(json => {
    //   if (json.status === 'OK') {
    //     setData(json.data)
    //     loading && setLoading(false)
    //   }
    // })
  }

  useEffect(() => {
    setData(DATA)
    setLoading(false)
    // getData('/json/players.json').then(data => {
    //   if (!data.error) {
    //     setPlayers(data)
    //   } else {
    //     console.error('Failed to load players:', data.message)
    //   }
    // })
  }, [])


  if (loading) return

  return (
    <div className={style.block}>
      <Paper headline={t('summery_report')} classes={['sm']}>
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.filter}>
            <div>
              <CustomSelect
                placeholder={t('select_player')}
                options={providerOptions}
                data={filter.provider}
                onChange={value => handleFilterChange('provider', value)}
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
              placeholder={t('apply')}
            />
          </div>
        </form>
      </Paper>
      <SummaryTable data={data}/>
    </div>
  )
}

export default Reports
