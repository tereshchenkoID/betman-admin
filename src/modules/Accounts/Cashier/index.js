import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { setCmd } from 'store/actions/cmdAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import Toggle from 'components/Toggle'
import CustomSelect from 'components/Select'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'
import GeneratePassword from 'modules/GeneratePassword'

import style from './index.module.scss'

const Cashier = ({ mock }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { request } = useApi()
  const [filter, setFilter] = useState(null)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleLoad = async () => {
    const { data, error } = await request(REQUEST_TYPE.GET, `cashier/add/general/${mock.id}`)

    if (!error) {
      setFilter(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, error } = await request(REQUEST_TYPE.POST, 'cashier/add/general/', formData)

    if (!error) {
      setFilter(data)
      dispatch(setCmd('refresh-table'))
      dispatch(setAside(null))
    }
  }

  useEffect(() => {
    handleLoad()
  }, [])

  const { options: shopsOptions } = useOptions(
    `shops_tree/${mock.agent.id}`,
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }],
    true
  )

  if (!filter) return <Loader type='content' />

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <CustomSelect
        placeholder={t('shop')}
        options={shopsOptions}
        data={filter.parent}
        onChange={value => handlePropsChange('parent', value)}
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
      {
        filter?.shift_mode &&
        <Toggle
          placeholder={t('shift_mode')}
          data={filter?.shift_mode}
          onChange={(e) => handlePropsChange('shift_mode', e)}
        />
      }
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
          onChange={() => handleLoad()}
        />
      </div>
    </form>
  )
}

export default Cashier
