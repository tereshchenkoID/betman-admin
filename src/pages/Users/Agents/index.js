import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { NAVIGATION, REQUEST_TYPE, service } from 'constant/config'

import { buildFormData } from 'helpers/buildFormData'
import { convertOptions } from 'helpers/convertOptions'
import { setAside } from 'store/actions/asideAction'
import { useApi } from 'hooks/useApi'

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
const INITIAL_SORT = { key: null, direction: null }

const Agents = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { request, loading } = useApi()
  const [filter, setFilter] = useState(INITIAL_FILTER)
  const [sort, setSort] = useState(INITIAL_SORT)
  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(service.QUANTITY[20])

  const handleSubmit = async (e, page = 0, nextFilter = filter, nextSort = sort) => {
    e && e.preventDefault()

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      locked: nextFilter.locked
    })

    if (nextSort.direction) {
      formData.append('sort_key', nextSort.key)
      formData.append('sort_direction', nextSort.direction)
    }

    setData(await request(REQUEST_TYPE.POST, 'agents/', formData))
  }

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
    setSort(INITIAL_SORT)
    handleSubmit(null, 0, INITIAL_FILTER, INITIAL_SORT)
  }

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleSortChange = (fieldName, sorted) => {
    if (!sorted) return

    setSort((prev) => {
      if (prev.key === fieldName) {
        const nextDirection =
          prev.direction === null
            ? 'asc'
            : prev.direction === 'asc' ? 'desc' : null;

        const value = {
          key: nextDirection ? fieldName : null,
          direction: nextDirection,
        }

        handleSubmit(null, 0, filter, value)
        return value
      }

      const value = {
        key: fieldName,
        direction: 'asc',
      }

      handleSubmit(null, 0, filter, value)
      return value
    })
  }

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  return (
    <>
      <Paper
        headline={t(NAVIGATION.agents.text)}
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
              classes={['primary']}
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
              classes={['primary']}
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
          loading &&
          <Loader type={'loading'} />
        }
        <Pagination
          position='top'
          pagination={data.pagination}
          handleSubmit={handleSubmit}
        />
        {
          data?.code &&
          <Table
            data={data?.data}
            config={CONFIG}
            sort={sort}
            handleSortChange={handleSortChange}
          />
        }
        <Pagination
          position='bottom'
          pagination={data.pagination}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </>
  )
}

export default Agents
