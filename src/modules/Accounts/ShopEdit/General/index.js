import React from 'react'
import { useTranslation } from 'react-i18next'

import { useSettingsStore } from 'stores/settingsStore'

import Toggle from 'components/Toggle'
import Field from 'components/Field'
import CustomSelect from 'components/Select'

const General = ({ filter, setFilter }) => {
  const { t } = useTranslation()
  const { settings } = useSettingsStore()

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  return (
    <>
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
        isDisabled={true}
        data={filter?.currency}
        onChange={() => {}}
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
    </>
  )
}

export default General
