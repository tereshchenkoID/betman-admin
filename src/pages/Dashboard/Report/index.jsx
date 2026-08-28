import {lazy, Suspense, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'

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

import { REQUEST_TYPE, TIMEFRAMES } from 'src/constant/config'

import { getTimeframeFrom, getTimeframeTo } from 'src/helpers/getTimeframe'
import { convertOptions } from 'src/helpers/convertOptions'
import { useApi } from 'src/hooks/useApi'
import { buildFormData } from 'src/helpers/buildFormData'
import { getDate } from 'src/helpers/getDate'
import { useFilterState } from 'src/hooks/useFilterState'

import Debug from 'modules/Debug'
import Field from 'components/Field'
import Button from 'components/Button'
import Paper from 'components/Paper'
import CustomSelect from 'components/Select'
import Skeleton from 'modules/Skeleton'

import style from './index.module.scss'

const OnlineMonitor = lazy(() => import('./OnlineMonitor'))
const GamesTypeUsage = lazy(() => import('./GamesTypeUsage'))
const GamesReport = lazy(() => import('./GamesReport'))
const SalesReport = lazy(() => import('./SalesReport'))
const SalesCountry = lazy(() => import('./SalesCountry'))
const RtpControl = lazy(() => import('./RtpControl'))

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

const INITIAL_FILTER = {
  agent: -1,
  'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
  'date-to': getDate(new Date(), 'datetime-local'),
  timeframe: '',
}

const SECTIONS = [
  { component: OnlineMonitor, height: 300 },
  { component: GamesTypeUsage, height: 300 },
  { component: GamesReport, height: 300 },
  { component: SalesReport, height: 600 },
  { component: SalesCountry, height: 250 },
  { component: RtpControl, height: 600 },
]

const Dashboard = () => {
  const { t } = useTranslation()
  const { request } = useApi()
  const [result, setResult] = useState({})

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const handleSubmit = async (e, nextFilter = filter) => {
    e && e.preventDefault()

    const formData = buildFormData(nextFilter)
    const { data, error } = await request(REQUEST_TYPE.POST, `dashboard/`, formData)

    if (!error) {
      setResult(data)
    }
  }

  useEffect(() => {
    handleSubmit()
  }, [])

  return (
    <>
      <Paper headline={t('navigation.dashboard')} classes={['sm']}>
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.filter}>
            <CustomSelect
              placeholder={t('timeframe')}
              options={convertOptions(TIMEFRAMES, t)}
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
            <Field
              type={'datetime-local'}
              placeholder={t('date_from')}
              data={filter['date-from']}
              onChange={value => handlePropsChange('date-from', value)}
            />
            <Field
              type={'datetime-local'}
              placeholder={t('date_to')}
              data={filter['date-to']}
              onChange={value => handlePropsChange('date-to', value)}
            />
            <div />
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
      <div className={style.grid}>
        {
          SECTIONS.map(({ component: Component, height }, idx) => (
            <Suspense
              key={idx}
              fallback={<Skeleton styles={{ height }} counts={1} />}
            >
              <Component data={result} />
            </Suspense>
          ))
        }
      </div>
    </>
  )
}

export default Dashboard
