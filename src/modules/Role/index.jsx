import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ACCOUNT_LEVEl,
  ACCOUNT_TYPE
} from 'src/constant/config'

import { useAuthStore } from 'src/stores/authStore'

import CustomSelect from 'components/Select'

const Role = ({ data, onChange, isRequired = true, placeholder }) => {
  const { t } = useTranslation()
  const { auth } = useAuthStore()

  const usersOptions = useMemo(() => {
    const baseOptions = [{ value: -1, label: t('select_from_list') }]
    const currentUserRole = auth?.role

    const filteredRoles = Object.entries(ACCOUNT_TYPE)
      .filter(([key]) => {
        if (currentUserRole === ACCOUNT_LEVEl.MANAGER) {
          // return (key !== '0' && key !== '1')
          return (key !== '0')
        }

        if (currentUserRole === ACCOUNT_LEVEl.ADMIN) {
          return key
        }

        return false
      })
      .map(([key, value]) => ({
        value: key,
        label: t(`account_types.${value.toLowerCase()}`)
      }))

    return [...baseOptions, ...filteredRoles]
  }, [t, auth?.role])

  return (
    <CustomSelect
      placeholder={placeholder || t('role')}
      options={usersOptions}
      data={data}
      onChange={onChange}
      isRequired={isRequired}
    />
  )
}

export default Role
