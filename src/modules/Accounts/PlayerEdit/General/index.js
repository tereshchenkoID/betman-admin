import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useOptions } from 'hooks/useOptions'

import Field from 'components/Field'
import CustomSelect from 'components/Select'

const General = ({ filter, setFilter }) => {
  const { t } = useTranslation()
  const { settings } = useSelector(state => state.settings)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const { options: bonusesOptions } = useOptions(
    'bonuses_list/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('all') }]
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
          { value: -1, label: t('all') },
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
    </>
  )
}

export default General
