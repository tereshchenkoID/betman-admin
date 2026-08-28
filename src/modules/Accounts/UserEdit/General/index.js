import { useTranslation } from 'react-i18next'

import { ACCOUNT_LEVEl } from 'constant/config'

import { useAuthStore } from 'stores/authStore'

import Field from 'components/Field'
import Role from 'modules/Role'

const General = ({ filter, handlePropsChange }) => {
  const { t } = useTranslation()
  const { auth } = useAuthStore()

  return (
    <>
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter?.username}
        onChange={(e) => handlePropsChange('username', e)}
        isDisabled={true}
        isRequired={true}
      />
      <Field
        type={'text'}
        placeholder={t('contact')}
        data={filter?.contact}
        onChange={(e) => handlePropsChange('contact', e)}
        isRequired={true}
      />
      {
        (
          auth?.role === ACCOUNT_LEVEl.ADMIN ||
          auth?.role === ACCOUNT_LEVEl.MANAGER
        ) &&
        <Role
          data={filter?.role}
          onChange={value => handlePropsChange('role', value)}
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
