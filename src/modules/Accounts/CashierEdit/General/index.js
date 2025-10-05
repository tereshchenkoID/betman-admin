import React from 'react'
import { useTranslation } from 'react-i18next'

import Toggle from 'components/Toggle'
import Field from 'components/Field'

const General = ({ filter, setFilter }) => {
  const { t } = useTranslation()

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
    </>
  )
}

export default General
