import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { ACCOUNT_TYPE } from 'constant/config'

import { useOptions } from 'hooks/useOptions'
import { useAuth } from 'hooks/useAuth'

import Toggle from 'components/Toggle'
import Field from 'components/Field'
import CustomSelect from 'components/Select'

const General = ({ mock, filter, setFilter }) => {
  const { t } = useTranslation()
  const { auth } = useAuth()
  const { settings } = useSelector(state => state.settings)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: String(el.id), label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  return (
    <>
      <Field
        type={'text'}
        placeholder={t('name')}
        data={filter?.name}
        onChange={(e) => handlePropsChange('name', e)}
        isRequired={true}
      />
      <CustomSelect
        placeholder={t('agent')}
        options={agentsOptions}
        data={filter?.parent}
        onChange={value => handlePropsChange('parent', value)}
        isRequired={true}
      />
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter?.username}
        onChange={(e) => handlePropsChange('username', e)}
        isDisabled={true}
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
        data={filter?.currency}
        onChange={value => handlePropsChange('currency', value)}
        isRequired={true}
      />
      {
        auth.unlimited_balance === '1' &&
        <Toggle
          placeholder={t('unlimited_balance')}
          data={filter?.unlimited_balance}
          onChange={(e) => handlePropsChange('unlimited_balance', e)}
        />
      }
      {
        (auth?.role === ACCOUNT_TYPE.ADMIN || (auth.create_subagents === '1' && mock?.id !== auth?.id)) &&
        <Toggle
          placeholder={t('create_subagents')}
          data={filter?.create_subagents}
          onChange={(e) => handlePropsChange('create_subagents', e)}
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
    </>
  )
}

export default General
