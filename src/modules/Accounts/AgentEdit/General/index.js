import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useAuth } from 'hooks/useAuth'
import { postData } from 'helpers/api'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Toggle from 'components/Toggle'
import Password from 'components/Password'
import Field from 'components/Field'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const General = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { auth } = useAuth()

  const initialValue = {
    id: auth.id,
    username: auth.username,
    old_password: '',
    new_password: '',
    confirm_password: '',
    short_form: '1'
  }

  const [filter, setFilter] = useState(initialValue)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  // TODO change url
  const handleSubmit = e => {
    e.preventDefault()
    const formData = new FormData()

    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    postData('general', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
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

  return (
    <>
      <Debug data={filter} />
      <form className={style.block} onSubmit={handleSubmit}>
        <Field
          type={'text'}
          placeholder={t('username')}
          data={filter.username}
          classes={['disabled']}
          required={true}
        />
        <Password
          placeholder={t('old_password')}
          data={filter.old_password}
          onChange={value => handlePropsChange('old_password', value)}
          required={true}
        />
        <GeneratePassword
          list={['new_password', 'confirm_password']}
          data={filter}
          action={setFilter}
          filter={filter}
          handlePropsChange={handlePropsChange}
        />
        <Toggle
          placeholder={t('short_form')}
          data={filter.short_form}
          onChange={(e) => handlePropsChange('short_form', e)}
        />
        <div className={style.actions}>
          <Button
            type={'submit'}
            classes={'primary'}
            placeholder={t('save')}
          />
          <Button
            type={'reset'}
            placeholder={t('cancel')}
            onChange={handleResetForm}
          />
        </div>
      </form>
    </>
  )
}

export default General
