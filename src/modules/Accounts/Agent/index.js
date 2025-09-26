import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { useAuth } from 'hooks/useAuth'

import Field from 'components/Field'
import Button from 'components/Button'
import Toggle from 'components/Toggle'
import CustomSelect from 'components/Select'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'
import GeneratePassword from 'modules/GeneratePassword'

import style from './index.module.scss'

const Agent = () => {
  const { t } = useTranslation()
  const { auth } = useAuth()
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
    const json = await request(REQUEST_TYPE.GET, 'agent/add/general/')
    setFilter(json?.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const json = await request(REQUEST_TYPE.POST, 'agent/add/general/', formData)
    setFilter(json?.data)
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
        onChange={value => handlePropsChange('currency', value)}
        isRequired={true}
      />
      {
        auth.unlimited_balance !== '1' &&
        <Toggle
          placeholder={t('unlimited_balance')}
          data={filter?.unlimited_balance}
          onChange={(e) => handlePropsChange('unlimited_balance', e)}
        />
      }
      {
        auth.create_subagents !== '1' &&
        <Toggle
          placeholder={t('create_subagents')}
          data={filter?.create_subagents}
          onChange={(e) => handlePropsChange('create_subagents', e)}
        />
      }
      <GeneratePassword
        list={['password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
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

export default Agent
