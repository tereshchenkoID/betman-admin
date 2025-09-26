import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { NAVIGATION, REQUEST_TYPE, service } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { buildFormData } from 'helpers/buildFormData'
import { convertOptions } from 'helpers/convertOptions'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Loader from 'components/Loader'
import CustomSelect from 'components/Select'
import Debug from 'modules/Debug'
import Pagination from 'modules/Pagination'
import Table from './Table'

import style from './index.module.scss'

const CONFIG = [
  { key: 'id', text: 'id', sorted: true },
  { key: 'agent.username', text: 'agent' },
  { key: 'username', text: 'username', sorted: true },
  { key: 'full_name', text: 'full_name', sorted: true },
  { key: 'credits', text: 'credits' },
  { key: 'currency', text: 'currency' },
  { key: 'locked', text: 'locked' },
  { key: 'date_created', text: 'date_created', sorted: true }
]

const Shops = () => {
  const { t } = useTranslation()
  const { agent } = useParams()
  const { request, loading } = useApi()

  const INITIAL_FILTER = { q: '', locked: -1, agent: Number(agent) || '' }
  const INITIAL_SORT = { key: null, direction: null }

  const [filter, setFilter] = useState(INITIAL_FILTER)
  const [data, setData] = useState({})
  const [sort, setSort] = useState(INITIAL_SORT)
  const [quantity, setQuantity] = useState(service.QUANTITY[20])
  const isSingle = agent

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

    if (isSingle) {
      formData.append('agent', agent)
    }

    setData(await request(REQUEST_TYPE.POST, 'shops/', formData))
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

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('all') }]
  )

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  return (
    <>
      <Paper
        headline={t(NAVIGATION.shops.text)}
        classes={['sm']}
        quantity={!isSingle && quantity}
        setQuantity={!isSingle && setQuantity}
      >
        <Debug data={{...filter, ...sort}} />
        <form onSubmit={handleSubmit}>
          <div className={style.grid}>
            <Field
              type='text'
              placeholder={t('id_username')}
              data={filter['q']}
              onChange={value => handlePropsChange('q', value)}
            />
            <CustomSelect
              placeholder={t('agents')}
              options={agentsOptions}
              data={filter.agent}
              onChange={value => handlePropsChange('agent', value)}
            />
            <CustomSelect
              placeholder={t('locked')}
              options={[
                { value: -1, label: t('all') },
                ...convertOptions(service.YES_NO, t)
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
        </form>
      </Paper>
      <Paper>
        {
          loading &&
          <Loader type={'loading'} />
        }
        <>
          {
            !isSingle &&
            <Pagination
              position='top'
              pagination={data.pagination}
              handleSubmit={handleSubmit}
            />
          }
          {
            data?.code &&
            <Table
              data={data.data}
              config={CONFIG}
              sort={sort}
              handleSortChange={handleSortChange}
            />
          }
          {
            !isSingle &&
            <Pagination
              position='bottom'
              pagination={data.pagination}
              handleSubmit={handleSubmit}
            />
          }
        </>
      </Paper>
    </>
  )
}

export default Shops
