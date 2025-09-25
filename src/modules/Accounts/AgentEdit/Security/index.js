import React from 'react'
import { useTranslation } from 'react-i18next'

import Password from 'components/Password'

const Security = ({ filter, setFilter }) => {
  const { t } = useTranslation()

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  return (
    <>
      <Password
        placeholder={t('old_password')}
        data={filter?.old_password}
        onChange={(e) => handlePropsChange('old_password', e)}
      />
      <Password
        placeholder={t('new_password')}
        data={filter?.new_password}
        onChange={(e) => handlePropsChange('new_password', e)}
      />
    </>
  )
}

export default Security
