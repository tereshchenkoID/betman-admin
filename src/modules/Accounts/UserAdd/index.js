import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { REQUEST_TYPE } from 'constant/config'

import { useAsideStore } from 'stores/asideStore'
import { useCmdStore } from 'stores/cmdStore'

import { useApi } from 'hooks/useApi'
import { useFilterState } from 'hooks/useFilterState'

import Field from 'components/Field'
import Button from 'components/Button'
import Loader from 'components/Loader'
import Debug from 'modules/Debug'
import GeneratePassword from 'modules/GeneratePassword'
import Role from 'modules/Role'

import style from './index.module.scss'

const UserAdd = ({ mock }) => {
  const { t } = useTranslation()
  const { setAside } = useAsideStore()
  const { setCmd } = useCmdStore()
  const { request } = useApi()
  const { filter, setFilter, handlePropsChange } = useFilterState(null)

  const handleLoad = async () => {
    const { data, error } = await request(REQUEST_TYPE.GET, `user/add/general/${mock.id || 0}`)

    if (!error) {
      setFilter(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, error } = await request(REQUEST_TYPE.POST, 'user/add/general/', formData)

    if (!error) {
      setFilter(data)
      setCmd('refresh-table')
      setAside(null)
    }
  }

  useEffect(() => {
    handleLoad()
  }, [])

  if (!filter) return <Loader type='content' />

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <Role
        data={filter?.role}
        onChange={value => handlePropsChange('role', value)}
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
      <Field
        type={'text'}
        placeholder={t('contact')}
        data={filter?.contact}
        onChange={(e) => handlePropsChange('contact', e)}
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

export default UserAdd
