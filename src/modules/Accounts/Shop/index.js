import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { setCmd } from 'store/actions/cmdAction'
import {setAside} from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import Toggle from 'components/Toggle'
import CustomSelect from 'components/Select'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'
import GeneratePassword from 'modules/GeneratePassword'

import style from './index.module.scss'

const Shop = ({ mock }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { settings } = useSelector(state => state.settings)
  const { request } = useApi()
  const [filter, setFilter] = useState(null)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleLoad = async () => {
    const { data, error } = await request(REQUEST_TYPE.GET, `shop/add/general/${mock.id || 0}`)

    if (!error) {
      setFilter(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, error } = await request(REQUEST_TYPE.POST, 'shop/add/general/', formData)

    if (!error) {
      setFilter(data)
      dispatch(setCmd('refresh-table'))
      dispatch(setAside(null))
    }
  }

  useEffect(() => {
    handleLoad()
  }, [])

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('all') }]
  )

  if (!filter) return <Loader type='content' />

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <CustomSelect
        placeholder={t('agents')}
        options={agentsOptions}
        data={filter?.parent}
        onChange={value => handlePropsChange('parent', value)}
        isDisabled={true}
      />
      <Field
        type={'text'}
        placeholder={t('name')}
        data={filter?.name}
        onChange={(e) => handlePropsChange('name', e)}
        isRequired={true}
      />
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter?.username}
        onChange={(e) => handlePropsChange('username', e)}
        isRequired={true}
      />
      <GeneratePassword
        list={['password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <CustomSelect
        placeholder={t('currency')}
        options={[
          { value: -1, label: t('all') },
          ...Object.entries(settings?.currencies).map(([key, el], index) => ({
            value: key,
            label: el.text
          }))
        ]}
        data={filter?.currency}
        onChange={(e) => handlePropsChange('currency', e)}
        isRequired={true}
      />
      {
        filter?.unlimited_balance &&
        <Toggle
          placeholder={t('unlimited_balance')}
          data={filter?.unlimited_balance}
          onChange={(e) => handlePropsChange('unlimited_balance', e)}
        />
      }
      {
        filter?.auto_print_receipts &&
        <Toggle
          placeholder={t('auto_print_receipts')}
          data={filter?.auto_print_receipts}
          onChange={(e) => handlePropsChange('auto_print_receipts', e)}
        />
      }
      <Field
        type={'text'}
        placeholder={t('contact')}
        data={filter?.contact}
        onChange={(e) => handlePropsChange('contact', e)}
      />
      <Field
        type={'email'}
        placeholder={t('email')}
        data={filter?.email}
        onChange={(e) => handlePropsChange('email', e)}
      />
      <Field
        type={'text'}
        placeholder={t('phone')}
        data={filter?.phone}
        onChange={(e) => handlePropsChange('phone', e)}
      />
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={['primary']}
          placeholder={t('create')}
        />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={handleLoad}
        />
      </div>
    </form>
  )
}

export default Shop
