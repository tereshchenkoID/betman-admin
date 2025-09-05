import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { service } from 'constant/config'

import { getDate } from 'helpers/getDate'
import { postData } from 'helpers/api'
import { convertOptions } from 'helpers/convertOptions'
import { setAside } from 'store/actions/asideAction'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Loader from 'components/Loader'
import CustomSelect from 'components/Select'
import Pagination from 'modules/Pagination'
import Debug from 'modules/Debug'
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
  const dispatch = useDispatch()
  const initialValue = {
    'q': '',
    'locked': '',
    'date-from': getDate(new Date().setHours(-2200, 0, 0, 0), 'datetime-local'),
    'date-to': getDate(new Date(), 'datetime-local'),
  }
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(initialValue)
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(20)
  const [sort, setSort] = useState({
    key: null,
    direction: null,
  })

  const handleSubmit = (e, page)  => {
    e && e.preventDefault()

    setLoading(true)

    const formData = new FormData()
    formData.append('page', page)
    formData.append('quantity', quantity)
    formData.append('q', filter['q'])
    formData.append('locked', filter['locked'])
    formData.append('date-from', filter['date-from'])
    formData.append('date-to', filter['date-to'])

    if (sort.direction !== null) {
      formData.append('sort_key', sort.key)
      formData.append('sort_direction', sort.direction)
    }

    postData(`agents/`).then(json => {
      if (json?.code === '0') {
        setData(json)
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

  const handleSortChange = (fieldName) => {
    setSort((prev) => {
      if (prev.key === fieldName) {
        const nextDirection =
          prev.direction === null
            ? 'asc'
            : prev.direction === 'asc'
              ? 'desc'
              : null;

        return {
          key: nextDirection ? fieldName : null,
          direction: nextDirection,
        };
      }

      return {
        key: fieldName,
        direction: 'asc',
      };
    });
  }

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity, sort])

  return (
    <>
      <Paper
        headline={t('agents')}
        classes={['sm']}
        quantity={quantity}
        setQuantity={setQuantity}
      >
        <Debug data={sort} />
        <Debug data={filter} />
        <form onSubmit={handleSubmit}>
          <div className={style.grid}>
            <Field
              type='text'
              placeholder={t('id_username')}
              data={filter['q']}
              onChange={value => handlePropsChange('q', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('date_from')}
              data={filter['date-from']}
              onChange={value => handlePropsChange('date-from', value)}
            />
            <Field
              type='datetime-local'
              placeholder={t('date_to')}
              data={filter['date-to']}
              onChange={value => handlePropsChange('date-to', value)}
            />
            <CustomSelect
              placeholder={t('locked')}
              options={convertOptions(service.YES_NO)}
              data={filter['locked']}
              onChange={value => handlePropsChange('locked', value)}
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
          <div className={style.actions}>
            <Button
              classes={'primary'}
              placeholder={t('add_agent')}
              onChange={(e) => {
                dispatch(
                  setAside({
                    meta: {
                      title: t('add_agent'),
                      cmd: 'account-agent',
                      buttonRef: e.target,
                    }
                  }),
                )
              }}
            />
          </div>
        </form>
      </Paper>
      <Paper classes={[style.paper]}>
        {
          loading
            ?
              <Loader type={'content'} />
            :
              <>
                <Pagination
                  position='top'
                  pagination={data.pagination}
                  handleSubmit={handleSubmit}
                />
                <Table
                  data={data.data}
                  config={CONFIG}
                  sort={sort}
                  handleSortChange={handleSortChange}
                />
                <Pagination
                  position='bottom'
                  pagination={data.pagination}
                  handleSubmit={handleSubmit}
                />
              </>
        }
      </Paper>
    </>
  )
}

export default Agents
