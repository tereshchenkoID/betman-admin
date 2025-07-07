import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {getData, postData} from 'hooks/useRequest'

import Debug from 'modules/Debug'
import { getDate } from 'helpers/getDate'
import Button from 'components/Button'
import Paper from 'components/Paper'
import CustomSelect from "components/Select";
import Field from 'components/Field'
import HistoryTable from "./HistoryTable";

import style from './index.module.scss'


const DATA = [
  {
    id: 1,
    player: 'Agent X',
    provider: 'casino',
    game: 'game 1',
    startDate: '17.06.2025, 17:51:02',
    bet: '222',
    toWin: '222',
    profit: '222',
    currency: 'UAH',
    action: 'action',
  },
  {
    id: 2,
    player: 'Agent Y',
    provider: 'casino 2',
    game: 'game 2',
    startDate: '17.06.2025, 16:39:31',
    bet: '111',
    toWin: '111',
    profit: '111',
    currency: 'EUR',
    action: 'action',
  },
];

const History = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState({
    player: '',
    kiosk: '',
    provider: '',
    game: '',
    'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
  })

  const pleyerOptions = [
    { label: 'Agent X', value: 'Agent X' },
    { label: 'Agent Y', value: 'Agent Y' },
  ]

  const kioskOptions = [
    { label: 'Kiosk 1', value: 'Kiosk 1' },
    { label: 'Kiosk 2', value: 'Kiosk 2' },
  ]

  const providerOptions = [
    { label: 'Provider 1', value: 'Provider 1' },
    { label: 'Provider 2', value: 'Provider 2' },
  ]

  const gameOptions = [
    { label: 'Game 1', value: 'Game 1' },
    { label: 'Game 2', value: 'Game 2' },
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
      <Paper headline={t('history_report')} classes={['sm']}>
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.filter}>
            <div>
              <CustomSelect
                placeholder={t('select_player')}
                options={pleyerOptions}
                data={filter.player}
                onChange={value => handleFilterChange('provider', value)}
              />
            </div>
            <div>
              <CustomSelect
                placeholder={t('select_kiosk')}
                options={providerOptions}
                data={filter.kiosk}
                onChange={value => handleFilterChange('kiosk', value)}
              />
            </div>
            <div>
              <CustomSelect
                placeholder={t('select_provider')}
                options={gameOptions}
                data={filter.provider}
                onChange={value => handleFilterChange('provider', value)}
              />
            </div>
            <div>
              <CustomSelect
                placeholder={t('select_game')}
                options={kioskOptions}
                data={filter.game}
                onChange={value => handleFilterChange('game', value)}
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
      <HistoryTable data={data}/>
    </div>
  )
}

export default History
