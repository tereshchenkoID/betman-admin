import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'

import { getDate } from "helpers/getDate"
import { getData } from "hooks/useRequest"

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from "components/Field"
import Loader from "components/Loader"
import Debug from 'modules/Debug'
import Pagination from "modules/Pagination"
import Table from './Table'

import style from './index.module.scss'

const CONFIG = [
  {
    key: 'id',
    text: 'id',
    sorted: true,
  },
  {
    key: 'username',
    text: 'username',
    sorted: true,
  },
  {
    key: 'full_name',
    text: 'full_name',
    sorted: true,
  },
  {
    key: 'credits',
    text: 'credits',
  },
  {
    key: 'currency',
    text: 'currency',
  },
  {
    key: 'locked',
    text: 'locked',
  },
  {
    key: 'date_created',
    text: 'date_created',
    sorted: true,
  }
]

const Agents = () => {
  const { t } = useTranslation()
  const initialValue = {
    'date-from': getDate(new Date().setHours(-24, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
  }
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(initialValue)
  const [data, setData] = useState({})
  const [pagination, setPagination] = useState({
    page: 0,
    quantity: 20,
    results: 0,
    pages: 0,
  })

  const handleSubmit = e => {
    e && e.preventDefault()

    const formData = new FormData()
    formData.append('date-from', filter['date-from'])
    formData.append('date-to', filter['date-to'])
    formData.append('page', pagination.page)
    formData.append('quantity', pagination.quantity)

    // TODO Update after api on postData
    getData('http://localhost:3001/json/agents.json').then(json => {
      if (json.code === '0') {
        setData(json.data)
        setPagination(json.pagination)
        setLoading(false)
      } else {
        console.error('Failed to load players:', data.message)
      }
    })
  }

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const nextHandleSubmit = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.pages - 1),
    }))
  }

  const prevHandleSubmit = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 0),
    }))
  }

  const startHandlerSubmit = () => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
    }))
  }

  const endHandlerSubmit = () => {
    setPagination((prev) => ({
      ...prev,
      page: prev.pages - 1,
    }))
  }

  useEffect(() => {
    handleSubmit()
  }, [])

  return (
    <>
      <Paper
        headline={t('agents')}
        classes={['sm']}
        quantity={pagination.quantity}
        setQuantity={setPagination}
      >
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.grid}>
            <Field
              type="datetime-local"
              placeholder={t('date_from')}
              data={filter['date-from']}
              onChange={value => handlePropsChange('date-from', value)}
            />
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
      <Paper classes={[style.paper]}>
        {
          loading
            ?
              <Loader type={'block'} />
            :
              <>
                <Table
                  data={data}
                  config={CONFIG}
                  handleDataChange={setData}
                />
                <Pagination
                  position="bottom"
                  pagination={pagination}
                  nextHandler={nextHandleSubmit}
                  prevHandler={prevHandleSubmit}
                  startHandlerSubmit={startHandlerSubmit}
                  endHandlerSubmit={endHandlerSubmit}
                />
              </>
        }
      </Paper>
    </>
  )
}

export default Agents


// Shop
// filters: Subagent, Date create,

// Players
// filters: Subagent, Shop, Date create, Date last played, Date last deposit

// Cashier
// filters: Subagent, Shop, Date create, Date last played, Date last deposit, withdrawal


// Agent - 0
// Subagent - 1
// Shop - 2
// Cashier - 3
// Players - 4
