import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { timeframe } from 'constant/config'

import {
  Chart as ChartJS,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from 'chart.js'

import { postData } from 'hooks/useRequest'
import { getTimeframeFrom, getTimeframeTo } from 'helpers/getTimeframe'
import { convertOptions } from 'helpers/convertOptions'
import { getDate } from 'helpers/getDate'

import Debug from 'modules/Debug'
import Agents from 'modules/Agents'
import Select from 'components/Select'
import Field from 'components/Field'
import Button from 'components/Button'
import Paper from 'components/Paper'
import SalesCountry from './SalesCountry'
import SalesReport from './SalesReport'
import RtpControl from './RtpControl'
import OnlineMonitor from './OnlineMonitor'
import GamesReport from './GamesReport'
import GamesTypeUsage from './GamesTypeUsage'

import style from './index.module.scss'

ChartJS.register(
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

const Dashboard = () => {
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const initialValue = {
    agent: {
      id: agents[0].id,
      username: agents[0].username,
    },
    'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
    timeframe: '',
  }

  const [filter, setFilter] = useState(initialValue)

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleSubmit = event => {
    event && event.preventDefault()
    const formData = new FormData()

    formData.append('id', filter.agent.id)
    formData.append('username', filter.agent.username)
    formData.append('date-from', filter['date-from'])
    formData.append('date-to', filter['date-to'])

    postData('dashboard/', formData).then(json => {
      if (json.status === 'OK') {
        setData(json.data)
        loading && setLoading(false)
      }
    })
  }

  useEffect(() => {
    handleSubmit()

    const interval = setInterval(() => {
      handleSubmit()
    }, 60000)

    return () => clearInterval(interval)
  }, [filter])

  if (loading) return

  return (
    <div className={style.block}>
      <Paper headline={t('dashboard')} classes={['sm']}>
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.filter}>
            <div>
              <Agents
                data={filter.agent}
                options={agents}
                onChange={value => handlePropsChange('agent', value)}
              />
            </div>
            <div>
              <Select
                placeholder={t('timeframe')}
                options={convertOptions(timeframe.TIMEFRAME)}
                data={filter.timeframe}
                onChange={value => {
                  handlePropsChange('timeframe', value)
                  handlePropsChange(
                    'date-from',
                    getTimeframeFrom(value, 'datetime-local'),
                  )
                  handlePropsChange(
                    'date-to',
                    getTimeframeTo(value, 'datetime-local'),
                  )
                }}
              />
            </div>
            <div>
              <Field
                type={'datetime-local'}
                placeholder={t('date_from')}
                data={filter['date-from']}
                onChange={value => handlePropsChange('date-from', value)}
              />
            </div>
            <div>
              <Field
                type={'datetime-local'}
                placeholder={t('date_to')}
                data={filter['date-to']}
                onChange={value => handlePropsChange('date-to', value)}
              />
            </div>
            <div />
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
      <div className={style.grid}>
        <OnlineMonitor data={data} />
        <GamesTypeUsage data={data} />
        <GamesReport data={data} />
        <SalesReport data={data} />
        <SalesCountry data={data} />
        <RtpControl data={data} />
      </div>
    </div>
  )
}

export default Dashboard
