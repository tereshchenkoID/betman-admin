import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { REQUEST_TYPE } from 'constant/config'

import { useSettingsStore } from 'stores/settingsStore'
import { useAsideStore } from 'stores/asideStore'
import { useCmdStore } from 'stores/cmdStore'
import { useAuthStore } from 'stores/authStore'
import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from 'components/Select'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'
import GeneratePassword from 'modules/GeneratePassword'

import style from './index.module.scss'

const Player = ({ mock }) => {
  const { t } = useTranslation()
  const { request } = useApi()
  const { settings } = useSettingsStore()
  const { setAside } = useAsideStore()
  const { setCmd } = useCmdStore()
  const { updateAuth } = useAuthStore()
  const [filter, setFilter] = useState(null)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleLoad = async () => {
    const { data, error } = await request(REQUEST_TYPE.GET, `player/add/general/${mock.agent?.id || mock.id || 0}`)

    if (!error) {
      setFilter(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, credits, error } = await request(REQUEST_TYPE.POST, 'player/add/general/', formData)

    if (!error) {
      setFilter(data)
      setCmd('refresh-table')
      setAside(null)

      if (credits) {
        updateAuth({credits})
      }
    }
  }

  useEffect(() => {
    handleLoad()
  }, [])

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  const { options: bonusesOptions } = useOptions(
    'bonuses_list/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  if (!filter) return <Loader type='content' />

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <CustomSelect
        placeholder={t('agent')}
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
      <GeneratePassword
        list={['password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <div className={style.grid}>
        <Field
          type={'number'}
          placeholder={t('balance')}
          data={filter?.balance}
          onChange={(e) => handlePropsChange('balance', e)}
          isRequired={true}
        />
        <CustomSelect
          placeholder={t('currency')}
          options={[
            { value: -1, label: t('select_from_list') },
            ...Object.entries(settings?.currencies).map(([key, el], index) => ({
              value: key,
              label: el.text
            }))
          ]}
          isDisabled={true}
          data={filter?.currency}
          onChange={() => {}}
          isRequired={true}
        />
      </div>
      <CustomSelect
        placeholder={t('bonuses')}
        options={bonusesOptions}
        data={filter?.bonuses}
        onChange={value => handlePropsChange('bonuses', value)}
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
          onChange={() => handleLoad()}
        />
      </div>
    </form>
  )
}

export default Player
