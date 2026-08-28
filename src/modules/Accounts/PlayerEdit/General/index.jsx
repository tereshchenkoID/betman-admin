import { useTranslation } from 'react-i18next'

import Field from 'components/Field'

const General = ({ filter, handlePropsChange }) => {
  const { t } = useTranslation()

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
