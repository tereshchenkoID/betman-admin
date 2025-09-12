import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ACCOUNT_TYPE, service } from 'constant/config'

import { useAuth } from 'hooks/useAuth'
import { postData } from 'helpers/api'
import { useOptions } from 'hooks/useOptions'
import { convertOptions } from 'helpers/convertOptions'

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
  { key: 'agent.username', text: 'agent' },
  { key: 'shop.username', text: 'shop' },
  { key: 'username', text: 'username', sorted: true },
  { key: 'full_name', text: 'full_name', sorted: true },
  { key: 'credits', text: 'credits' },
  { key: 'currency', text: 'currency' },
  { key: 'locked', text: 'locked' },
  { key: 'date_created', text: 'date_created', sorted: true }
]

const Cashiers = () => {
  const { t } = useTranslation()
  const { auth } = useAuth()
  const { agent, shop } = useParams()

  const INITIAL_FILTER = { q: '', locked: -1, agent: Number(agent) || '', shop: Number(shop) || '' }
  const INITIAL_SORT = { key: null, direction: null }

  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(INITIAL_FILTER)
  const [data, setData] = useState({})
  const [sort, setSort] = useState(INITIAL_SORT)
  const [quantity, setQuantity] = useState(20)
  const isSingle = agent || shop

  const handleSubmit = async (e, page = 0, nextFilter = filter, nextSort = sort) => {
    e && e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('page', page)
    formData.append('quantity', quantity)
    formData.append('q', nextFilter.q)
    formData.append('locked', nextFilter.locked)

    if (nextSort.direction) {
      formData.append('sort_key', nextSort.key)
      formData.append('sort_direction', nextSort.direction)
    }

    if (agent) {
      formData.append('agent', agent)
    }

    if (shop) {
      formData.append('shop', shop)
    }

    try {
      const json = await postData('cashiers/', formData)
      if (json?.code === '0') {
        setData(json)
      } else {
        console.error('Failed to load shops:', json?.message)
      }
    } finally {
      setLoading(false)
    }
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

  const { options: shopsOptions } = useOptions(
    `shops_tree/${filter.agent}`,
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('all') }],
    Boolean(filter.agent)
  )

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  return (
    <>
      <Paper
        headline={`${t('cashiers')}${isSingle ? ': ' + agent : '' }`}
        classes={['sm']}
        quantity={!isSingle && quantity}
        setQuantity={!isSingle && setQuantity}
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
            {
              auth?.role === ACCOUNT_TYPE.AGENT &&
              <>
                <CustomSelect
                  placeholder={t('agents')}
                  options={agentsOptions}
                  data={filter.agent}
                  onChange={value => handlePropsChange('agent', value)}
                />
                {
                  filter.agent !== '' &&
                  <CustomSelect
                    placeholder={t('shops')}
                    options={shopsOptions}
                    data={filter.shop}
                    onChange={value => handlePropsChange('shop', value)}
                  />
                }
              </>
            }
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
        </form>
      </Paper>
      <Paper classes={[style.paper]}>
        {
          loading
            ?
              <Loader type={'content'} />
            :
              <>
                {
                  !isSingle &&
                  <Pagination
                    position='top'
                    pagination={data.pagination}
                    handleSubmit={handleSubmit}
                  />
                }
                <Table
                  data={data.data}
                  config={CONFIG}
                  sort={sort}
                  handleSortChange={handleSortChange}
                />
                {
                  !isSingle &&
                  <Pagination
                    position='bottom'
                    pagination={data.pagination}
                    handleSubmit={handleSubmit}
                  />
                }
              </>
        }
      </Paper>
    </>
  )
}

export default Cashiers
