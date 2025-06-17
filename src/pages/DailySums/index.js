import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { DEFAULT, timeframe } from 'constant/config'

import Debug from 'modules/Debug'
import Agents from 'modules/Agents'
import Paper from 'components/Paper'
import Field from 'components/Field'
import Select from 'components/Select'
import Button from 'components/Button'
import Table from './Table'

import { getTimeframeFrom, getTimeframeTo } from 'helpers/getTimeframe'
import { convertOptions } from 'helpers/convertOptions'
import { searchById } from 'helpers/searchById'
import { getDate } from 'helpers/getDate'

import style from './index.module.scss'

const config_1 = [
  {
    key: 'username',
    text: 'username',
  },
]

const config_2 = [
  {
    key: 'date-from',
    text: 'date_from',
    convert: false
  },
  {
    key: 'currency',
    text: 'currency',
    convert: false
  },
  {
    key: 'tickets',
    text: 'tickets',
    convert: false
  },
  {
    key: 'total_in',
    text: 'total_in',
    convert: true
  },
  {
    key: 'total_out',
    text: 'total_out',
    convert: true
  },
  {
    key: 'open_payouts',
    text: 'open_payouts',
    convert: true
  },
  {
    key: 'Jackpot_1_payout',
    text: 'jackpot_1_payout',
    convert: true
  },
  {
    key: 'Jackpot_2_payout',
    text: 'jackpot_2_payout',
    convert: true
  },
  {
    key: 'Jackpot_3_payout',
    text: 'jackpot_3_payout',
    convert: true
  },
  {
    key: 'Jackpot_1_contribution',
    text: 'jackpot_1_contribution',
    convert: true
  },
  {
    key: 'Jackpot_2_contribution',
    text: 'jackpot_2_contribution',
    convert: true
  },
  {
    key: 'Jackpot_3_contribution',
    text: 'jackpot_3_contribution',
    convert: true
  },
  {
    key: 'reversal',
    text: 'reversal',
    convert: true
  },
  {
    key: 'commission',
    text: 'commission',
    convert: true
  },
  {
    key: 'taxes',
    text: 'taxes',
    convert: true
  },
  {
    key: 'profit',
    text: 'profit',
    convert: true
  },
  {
    key: 'profit_usd',
    text: 'profit_usd',
    convert: true
  }
]

const DailyReports = () => {
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)

  const initialValue = {
    'agent': {
      'id': agents[0].id,
      'username': agents[0].username,
    },
    'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
    'timeframe': DEFAULT,
  }

  const [filter, setFilter] = useState(initialValue)
  const [cmd, setCmd] = useState(false)
  const [data, setData] = useState(agents)

  const handleResetForm = () => {
    setFilter(initialValue)
    setData(agents)
    setCmd('reset')
  }

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleSubmit = event => {
    event && event.preventDefault()
    setData(searchById(agents[0], filter.agent.id))
    setCmd('submit')
  }

  return (
    <>
      <Paper headline={t('daily_overview_report')} classes={['sm']}>
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.grid}>
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
                options={[
                  { value: DEFAULT, label: t('all') },
                  ...convertOptions(timeframe.TIMEFRAME)
                ]}
                data={filter.timeframe}
                onChange={value => {
                  handlePropsChange('timeframe', value)
                  handlePropsChange(
                    'date-from',
                    value === DEFAULT ? initialValue['date-from'] : getTimeframeFrom(value, 'datetime-local'),
                  )
                  handlePropsChange(
                    'date-to',
                    value === DEFAULT ? initialValue['date-from'] : getTimeframeTo(value, 'datetime-local'),
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
      <Paper classes={['sm']}>
        <Table
          config_1={config_1}
          config_2={config_2}
          data={data}
          filter={filter}
          cmd={cmd}
          setCmd={setCmd}
        />
      </Paper>
    </>
  )
}

export default DailyReports
