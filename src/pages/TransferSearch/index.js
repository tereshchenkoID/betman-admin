import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DEFAULT, types } from 'constant/config'

import { getTimeframeFrom } from 'helpers/getTimeframe'
import { convertOptions } from 'helpers/convertOptions'
import { searchById } from 'helpers/searchById'
import { getDate } from 'helpers/getDate'

import Debug from 'modules/Debug'
import Agents from 'modules/Agents'
import Paper from 'components/Paper'
import Field from 'components/Field'
import Select from 'components/Select'
import Button from 'components/Button'
import Table from './Table'

import style from './index.module.scss'

const config_1 = [
  {
    key: 'username',
    text: 'username',
  },
  {
    key: 'full_name',
    text: 'full_name',
  },
  {
    key: 'type',
    text: 'type',
  },
  {
    key: 'target',
    text: 'target',
  },
  {
    key: 'date',
    text: 'date',
  },
  {
    key: 'deposit',
    text: 'deposit',
  },
  {
    key: 'payout',
    text: 'payout',
  },
]

const config_2 = [
  {
    key: 'transfers',
    text: 'transfers',
  },
]

const TransferSearch = () => {
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)
  const { settings } = useSelector(state => state.settings)

  const initialValue = {
    agent: {
      id: agents[0].id,
      username: agents[0].username,
    },
    target: {
      id: '',
      username: '',
    },
    'date-from': getTimeframeFrom(3, 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
    'types': DEFAULT,
    'amount-from': '',
    'amount-to': '',
    'currency': DEFAULT,
  }
  const [filter, setFilter] = useState(initialValue)
  const [cmd, setCmd] = useState(false)
  const [data, setData] = useState(agents)

  const handleSubmit = event => {
    event && event.preventDefault()
    setData(searchById(agents[0], filter.agent.id))
    setCmd('submit')
  }

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

  return (
    <>
      <Paper headline={t('transfer_search')} classes={['sm']}>
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
              <Agents
                data={filter.target}
                options={agents}
                placeholder={t('target')}
                onChange={value => handlePropsChange('target', value)}
                full={true}
              />
            </div>
            <div>
              <Select
                placeholder={t('currency')}
                options={[
                  { value: DEFAULT, label: t('all') },
                  ...settings.currencies.map(currency => ({
                    value: currency,
                    label: currency,
                  }))
                ]}
                data={filter.currency}
                onChange={value => handlePropsChange('currency', value)}
              />
            </div>
            <div>
              <Select
                placeholder={t('types')}
                options={[
                  { value: DEFAULT, label: t('all') },
                  ...convertOptions(types.AGENT_TRANSFER_TYPE)
                ]}
                data={filter.currency}
                onChange={value => handlePropsChange('types', value)}
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
            <div>
              <Field
                type={'number'}
                placeholder={t('amount_from')}
                data={filter['amount-from']}
                onChange={value => handlePropsChange('amount-from', value)}
              />
            </div>
            <div>
              <Field
                type={'number'}
                placeholder={t('amount_to')}
                data={filter['amount-to']}
                onChange={value => handlePropsChange('amount-to', value)}
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
          data={data}
          config_1={config_1}
          config_2={config_2}
          filter={filter}
          cmd={cmd}
          setCmd={setCmd}
        />
      </Paper>
    </>
  )
}

export default TransferSearch
