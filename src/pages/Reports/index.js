import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {getData, postData} from 'hooks/useRequest'

import Debug from 'modules/Debug'
import { getDate } from 'helpers/getDate'
import Button from 'components/Button'
import Paper from 'components/Paper'
import CustomSelect from "components/Select";
import Field from 'components/Field'
import SummaryTable from "./SummaryTable";

import style from './index.module.scss'


const DATA = [
  {
    currency: 'UAH',
    provider: 'Agent X',
    profit: '111',
    balanceProfit: '222',
    bonusProfit: '222',
    cashProfit: '222',
    profitPSP: '222',
    jackpot: '222',
    spin: '222',
    netProfit: '222',
  },
  {
    currency: 'EUR',
    provider: 'Agent Y',
    profit: '222',
    balanceProfit: '111',
    bonusProfit: '111',
    cashProfit: '111',
    profitPSP: '111',
    jackpot: '111',
    spin: '111',
    netProfit: '111',
  },
];

const Reports = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState({
    provider: '',
    kiosk: '',
    'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
  })

  const providerOptions = [
    { label: 'Agent X', value: 'Agent X' },
    { label: 'Agent Y', value: 'Agent Y' },
  ]

  const kioskOptions = [
    { label: 'Kiosk 1', value: 'Kiosk 1' },
    { label: 'Kiosk 2', value: 'Kiosk 1' },
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
              <CustomSelect
                placeholder={t('select_kiosk')}
                options={kioskOptions}
                data={filter.kiosk}
                onChange={value => handleFilterChange('kiosk', value)}
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
            <div className={style.actions}>
              <Button
                type={'submit'}
                classes={'primary'}
                placeholder={t('apply')}
              />
            </div>
          </div>
        </form>
      </Paper>
      <SummaryTable data={data}/>
    </div>
  )
}

export default Reports
