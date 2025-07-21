import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Select from 'components/Select'
import ToggleSwitch from 'components/ToggleSwitch'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const General = ({ data, inherit, setUpdate }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [isEnabled, setIsEnabled] = useState(false)

  const [filter, setFilter] = useState({
    inherit: inherit,
    ...data.general
  })
  const toggle = () => setIsEnabled(prev => !prev)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)

    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    postData('accounts/edit/general/', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
        setUpdate(true)
      } else {
        dispatch(
          setToastify({
            type: 'error',
            text: json.error_message,
          }),
        )
      }
    })
  }

  useEffect(() => {
    handlePropsChange('inherit', inherit)
  }, [inherit])

  return (
    <>
      <Debug data={filter} />
      <form className={style.block} onSubmit={handleSubmit}>
        <Select
          placeholder={t('alternative_patch_placeholder')}
          options={[
            { value: '0', label: 'alternative patch 1' },
            { value: '1', label: 'alternative patch 2' },
            { value: '2', label: 'alternative patch 3' },
          ]}
          data={filter.alternative_patch}
          onChange={value => handlePropsChange('alternative_patch', value)}
        />
        <Button type={'button'} classes={'primary'} placeholder={t('apply')} onChange={() => alert('Apply')} />
        <GeneratePassword
          list={['new_password']}
          data={filter}
          action={setFilter}
          filter={filter}
          handlePropsChange={handlePropsChange}
        />
        <ToggleSwitch isOn={isEnabled} handleToggle={toggle} label={t('short_form')} />
        <div className={style.actions}>
          <Button type={'submit'} classes={'primary'} placeholder={t('save')} />
        </div>
      </form>
    </>
  )
}

export default General
