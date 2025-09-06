import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { service } from 'constant/config'

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
  { key: 'id', text: 'id', sorted: true },
  { key: 'username', text: 'username', sorted: true },
  { key: 'full_name', text: 'full_name', sorted: true },
  { key: 'credits', text: 'credits' },
  { key: 'currency', text: 'currency' },
  { key: 'locked', text: 'locked' },
  { key: 'date_created', text: 'date_created', sorted: true }
]

const INITIAL_FILTER = { q: '', locked: -1 }

const Agents = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(INITIAL_FILTER)
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(20)
  const [sort, setSort] = useState({
    key: null,
    direction: null,
  })

  const handleSubmit = async (e, page = 0) => {
    e && e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('page', page)
    formData.append('quantity', quantity)
    formData.append('q', filter.q)
    formData.append('locked', filter.locked)

    if (sort.direction) {
      formData.append('sort_key', sort.key)
      formData.append('sort_direction', sort.direction)
    }

    try {
      const json = await postData('agents/', formData)
      if (json?.code === '0') {
        setData(json)
      } else {
        console.error('Failed to load players:', json?.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
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
            : prev.direction === 'asc' ? 'desc' : null;

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
        <form onSubmit={(e) => handleSubmit(e, 0)}>
          <div className={style.grid}>
            <Field
              type='text'
              placeholder={t('id_username')}
              data={filter['q']}
              onChange={value => handlePropsChange('q', value)}
            />
            <CustomSelect
              placeholder={t('locked')}
              options={[
                { value: -1, label: t('all') },
                ...convertOptions(service.YES_NO)
              ]}
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
      <Paper>
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
