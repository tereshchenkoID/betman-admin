import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ACCESS_TYPE, ACCOUNT_TYPE, NAVIGATION, REQUEST_TYPE, service } from 'src/constant/config'

import { useAsideStore } from 'src/stores/asideStore'
import { useCmdStore } from 'src/stores/cmdStore'
import { useAuthStore } from 'src/stores/authStore'
import { useApi } from 'src/hooks/useApi'
import { useSort } from 'src/hooks/useSort'
import { useFilterState } from 'src/hooks/useFilterState'
import { buildFormData } from 'src/helpers/buildFormData'
import { convertOptions } from 'src/helpers/convertOptions'

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
  { key: 'email', text: 'email' },
  { key: 'phone', text: 'phone' },
  { key: 'date_created', text: 'date_created', sorted: true },
  { key: 'role', text: 'role' },
  { key: 'access', text: 'access' }
]

const Users = () => {
  const { t } = useTranslation()
  const { request, loading } = useApi()
  const { auth } = useAuthStore()
  const { setAside } = useAsideStore()
  const { cmd, setCmd } = useCmdStore()

  const INITIAL_FILTER = { q: '', role: -1, access: -1 }
  const INITIAL_SORT = { key: null, direction: null }

  const [data, setData] = useState({})
  const [quantity, setQuantity] = useState(service.QUANTITY[20])

  const handleSubmit = async (e, page = 0, nextFilter = filter, nextSort = sort) => {
    e && e.preventDefault()

    const formData = buildFormData({
      page,
      quantity,
      q: nextFilter.q,
      access: nextFilter.access,
      role: nextFilter.role,
    })

    if (nextSort.direction) {
      formData.append('sort_key', nextSort.key)
      formData.append('sort_direction', nextSort.direction)
    }

    setData(await request(REQUEST_TYPE.POST, 'users/', formData))
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)
  const { sort, setSort, handleSortChange } = useSort(INITIAL_SORT, handleSubmit, filter)

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
    setSort(INITIAL_SORT)
    handleSubmit(null, 0, INITIAL_FILTER, INITIAL_SORT)
  }

  const usersOptions = useMemo(() => [
    { value: -1, label: t('select_from_list') },
    ...Object.entries(ACCOUNT_TYPE).map(([key, value]) => ({
      value: key,
      label: t(`account_types.${value.toLowerCase()}`)
    }))
  ], [t])

  useEffect(() => {
    handleSubmit(null, 0);
  }, [quantity])

  useEffect(() => {
    if (cmd === 'refresh-table') {
      handleSubmit(null, data?.pagination?.page, filter, sort);
      setCmd(null)
    }
  }, [cmd])

  return (
    <>
      <Paper
        headline={t(NAVIGATION.users.text)}
        classes={['sm']}
        quantity={quantity}
        setQuantity={setQuantity}
      >
        <Debug data={{...filter, ...sort}} />
        <form onSubmit={(e) => handleSubmit(e, 0)}>
          <div className={style.grid}>
            <Field
              type='text'
              placeholder={t('id_username')}
              data={filter['q']}
              onChange={value => handlePropsChange('q', value)}
            />
            <CustomSelect
              placeholder={t('role')}
              options={usersOptions}
              data={filter.role}
              onChange={value => handlePropsChange('role', value)}
            />
            <CustomSelect
              placeholder={t('access')}
              options={[
                { value: -1, label: t('select_from_list') },
                ...convertOptions(ACCESS_TYPE, t)
              ]}
              data={filter['access']}
              onChange={value => handlePropsChange('access', value)}
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
          {
            (auth?.role === '0' || auth?.role === '1') &&
            <div className={style.actions}>
              <Button
                classes={['primary']}
                placeholder={t('add_user')}
                onChange={(e) => {
                  setAside({
                    meta: {
                      title: t('add_user'),
                      cmd: 'user-add',
                      buttonRef: e.target,
                    }
                  })
                }}
              />
            </div>
          }
        </form>
      </Paper>
      <Paper classes={[style.paper]}>
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
          <div className={style.table}>
            <Table
              data={data?.data}
              config={CONFIG}
              sort={sort}
              handleSortChange={handleSortChange}
            />
          </div>
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

export default Users
