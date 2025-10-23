import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ACCOUNT_TYPE, NAVIGATION, REQUEST_TYPE, service } from 'constant/config'

import { useAuth } from 'hooks/useAuth'
import { useApi } from 'hooks/useApi'
import { useSort } from 'hooks/useSort'
import { useOptions } from 'hooks/useOptions'
import { useFilterState } from 'hooks/useFilterState'
import { buildFormData } from 'helpers/buildFormData'
import { convertOptions } from 'helpers/convertOptions'
import { setCmd } from 'store/actions/cmdAction'

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
  { key: 'date_created', text: 'date_created', sorted: true }
]

const Cashiers = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { auth } = useAuth()
  const { agent, shop } = useParams()
  const { request, loading } = useApi()
  const { cmd } = useSelector(state => state.cmd)

  const INITIAL_FILTER = { q: '', locked: -1, agent: Number(agent) || -1, shop: Number(shop) || -1 }
  const INITIAL_SORT = { key: null, direction: null }

  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(service.QUANTITY[20])
  const isSingle = agent || shop

  const handleSubmit = async (e, page = 0, nextFilter = filter, nextSort = sort) => {
    e && e.preventDefault()

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      locked: nextFilter.locked,
      agent: filter.agent,
      shop: filter.shop,
    })

    if (nextSort.direction) {
      formData.append('sort_key', nextSort.key)
      formData.append('sort_direction', nextSort.direction)
    }

    setData(await request(REQUEST_TYPE.POST, 'cashiers/', formData))
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)
  const { sort, setSort, handleSortChange } = useSort(INITIAL_SORT, handleSubmit, filter)

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
    setSort(INITIAL_SORT)
    handleSubmit(null, 0, INITIAL_FILTER, INITIAL_SORT)
  }

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  const { options: shopsOptions } = useOptions(
    `shops_tree/${filter.agent}`,
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }],
    Boolean(filter.agent)
  )

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  useEffect(() => {
    if (cmd === 'refresh-table') {
      handleSubmit(null, data?.pagination?.page, filter, sort);
      dispatch(setCmd(null))
    }
  }, [cmd])

  return (
    <>
      <Paper
        headline={t(NAVIGATION.cashiers.text)}
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
            {
              (
                auth?.role === ACCOUNT_TYPE.ADMIN ||
                auth?.role === ACCOUNT_TYPE.AGENT
              ) &&
              <>
                <CustomSelect
                  placeholder={t('agent')}
                  options={agentsOptions}
                  data={filter.agent}
                  onChange={value => handlePropsChange('agent', value)}
                />
                {
                  filter.agent !== -1 &&
                  <CustomSelect
                    placeholder={t('shop')}
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
                { value: -1, label: t('select_from_list') },
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
      <Paper classes={[style.paper]}>
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

export default Cashiers
