import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { DEFAULT, statuses, types } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { getDate } from 'helpers/getDate'
import { convertOptions } from 'helpers/convertOptions'

import Paper from 'components/Paper'
import Field from 'components/Field'
import Select from 'components/Select'
import Button from 'components/Button'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'
import Agents from 'modules/Agents'
import Pagination from 'modules/Pagination'
import Ticket from './Ticket'

import style from './index.module.scss'

const config_1 = [
  {
    key: 'ticketId',
    text: 'ticket_id',
  },
  {
    key: 'username',
    text: 'shop',
  },
  {
    key: 'game',
    text: 'game_details',
  },
  {
    key: 'status',
    text: 'status',
  },
  {
    key: 'currency',
    text: 'currency',
  },
  {
    key: 'payout',
    text: 'payout',
  },
  {
    key: 'stake',
    text: 'sum_of_stakes',
  },
  {
    key: 'bookTime',
    text: 'finalized',
  },
]

const config_2 = [
  {
    key: 'group',
    text: 'gr',
  },
  {
    key: 'combi',
    text: 'combi',
  },
  {
    key: 'amount',
    text: 'stake',
  },
  {
    key: 'minwin',
    text: 'potential_min_win',
  },
  {
    key: 'maxwin',
    text: 'potential_max_min',
  },
  {
    key: 'bonus',
    text: 'bonus',
  },
]

const config_3 = [
  {
    key: 'details.game',
    text: 'game',
  },
  {
    key: 'details.eventId',
    text: 'event',
  },
  {
    key: 'details.teams',
    text: 'teams',
  },
  {
    key: 'market',
    text: 'type',
  },
  {
    key: 'selection',
    text: 'pick',
  },
  {
    key: 'odds',
    text: 'odds',
  },
  {
    key: 'details.results',
    text: 'results',
  },
  {
    key: 'status',
    text: 'state',
  },
]

const Tickets = () => {
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)
  const { settings } = useSelector(state => state.settings)
  const initialValue = {
    'agent': {
      'id': agents[0].id,
      'username': agents[0].username,
    },
    'ticket': '',
    'username': '',
    'state': DEFAULT,
    'type': DEFAULT,
    'date-from': getDate(new Date().setHours(0, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
    'amount-from': '',
    'amount-to': '',
    'currency': DEFAULT,
    'payout-from': '',
    'payout-to': ''
  }

  const [filter, setFilter] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [pagination, setPagination] = useState({
    page: 0,
    pages: 0,
    quantity: 50,
    results: 0,
  })

  useEffect(() => {
    if (pagination.results > 0) {
      setPagination(prevPagination => ({
        ...prevPagination,
        page: 0,
        pages: 0,
        results: 0,
      }))
      handleSubmit(null, 0)
    }
  }, [pagination.quantity])

  const handleResetForm = () => {
    setFilter(initialValue)
    handleSubmit(null, 0, initialValue)
  }

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handlePagination = (fieldName, fieldValue) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      [fieldName]: fieldValue,
    }))
  }

  const handleSubmit = (event, page = 0, filters = filter) => {
    event && event.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('page', page)
    formData.append('quantity', pagination.quantity)
    formData.append('id', filters.agent.id)

    Object.entries(filters).map(([key, value]) => {
      if(key !== 'agent') {
        formData.append(key, value)
        return true
      }
    })

    postData(`tickets/`, formData).then(json => {
      if (json.status === 'OK') {
        setData(json)
        setLoading(false)

        setPagination(prev => ({
          ...prev,
          results: json.results,
          pages: Math.floor(json.results / pagination.quantity),
        }))
      }
    })
  }

  const nextHandleSubmit = () => {
    const next = pagination.page < pagination.pages ? pagination.page + 1 : pagination.pages
    handlePagination('page', next)
    handleSubmit(null, next)
  }

  const prevHandleSubmit = () => {
    const prev = pagination.page > 0 ? pagination.page - 1 : 0
    handlePagination('page', prev)
    handleSubmit(null, prev)
  }

  const startHandlerSubmit = () => {
    handlePagination('page', 0)
    handleSubmit(null, 0)
  }

  const endHandlerSubmit = () => {
    handlePagination('page', pagination.pages)
    handleSubmit(null, pagination.pages)
  }

  useEffect(() => {
    handleSubmit(null, 0)
  }, [])

  return loading ? (
    <Loader />
  ) : (
    <>
      <Paper
        headline={t('tickets_search')}
        quantity={pagination.quantity}
        setQuantity={setPagination}
        classes={['sm']}
      >
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
              <Field
                type={'text'}
                placeholder={t('username')}
                data={filter.username}
                onChange={value => handlePropsChange('username', value)}
              />
            </div>
            <div>
              <Field
                type={'text'}
                placeholder={t('ticket')}
                data={filter.ticket}
                onChange={value => handlePropsChange('ticket', value)}
              />
            </div>
            <div>
              <Select
                placeholder={t('state')}
                options={[
                  { value: DEFAULT, label: t('all') },
                  ...convertOptions(statuses.TICKET_STATUSES)
                ]}
                data={filter.state}
                onChange={value => handlePropsChange('state', value)}
              />
            </div>
            <div>
              <Select
                placeholder={t('player_type')}
                options={[
                  { value: DEFAULT, label: t('all') },
                  ...convertOptions(types.PLAYER_TYPE)
                ]}
                data={filter.type}
                onChange={value => handlePropsChange('type', value)}
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
                data={filter['currency']}
                onChange={value => handlePropsChange('currency', value)}
              />
            </div>
            <div>
              <Field
                type={'number'}
                placeholder={t('payout_from')}
                data={filter['payout-from']}
                onChange={value => handlePropsChange('payout-from', value)}
              />
            </div>
            <div>
              <Field
                type={'number'}
                placeholder={t('payout_to')}
                data={filter['payout-to']}
                onChange={value => handlePropsChange('payout-to', value)}
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
        <Pagination
          position={'top'}
          pagination={pagination}
          nextHandler={nextHandleSubmit}
          prevHandler={prevHandleSubmit}
          startHandlerSubmit={startHandlerSubmit}
          endHandlerSubmit={endHandlerSubmit}
        />
        <div className={style.table}>
          <div className={style.row}>
            <div className={style.cell} />
            {config_1.map((el, idx) => (
              <div key={idx} className={style.cell}>
                {t(el.text)}
              </div>
            ))}
            <div className={style.cell} />
          </div>
          {data.data && data.data.length > 0 ? (
            data.data.map((el, idx) => (
              <div className={style.ticket} key={idx}>
                <Ticket
                  data={el}
                  action={setData}
                  config_1={config_1}
                  config_2={config_2}
                  config_3={config_3}
                />
              </div>
            ))
          ) : (
            <div className={style.ticket}>
              <div className={style.empty}>
                {t('no_matching_records_found')}
              </div>
            </div>
          )}
        </div>
        <Pagination
          position={'bottom'}
          pagination={pagination}
          nextHandler={nextHandleSubmit}
          prevHandler={prevHandleSubmit}
          startHandlerSubmit={startHandlerSubmit}
          endHandlerSubmit={endHandlerSubmit}
        />
      </Paper>
    </>
  )
}

export default Tickets
