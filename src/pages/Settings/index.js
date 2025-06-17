import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'

import Debug from 'modules/Debug'
import GeneratePassword from 'modules/GeneratePassword'
import Field from 'components/Field'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Password from 'components/Password'

import style from './index.module.scss'

const Settings = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { auth } = useSelector(state => state.auth)

  const initialValue = {
    id: auth.id,
    username: auth.username,
    old_password: '',
    new_password: '',
    confirm_password: '',
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

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('id', filter.id)
    formData.append('username', filter.username)
    formData.append('old_password', filter.old_password)
    formData.append('new_password', filter.new_password)

    if (filter.new_password !== filter.confirm_password) {
      dispatch(
        setToastify({
          type: 'error',
          text: t('passwords_do_not_match'),
        }),
      )
    } else if (
      filter.new_password.length < 3 ||
      filter.confirm_password.length < 3
    ) {
      dispatch(
        setToastify({
          type: 'error',
          text: t('password_must_length'),
        }),
      )
    } else {
      postData(`password/`, formData).then(json => {
        if (json.code === '0') {
          dispatch(
            setToastify({
              type: 'success',
              text: json.message,
            }),
          ).then(() => {
            handleResetForm()
          })
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
  }

  return (
    <div className={style.block}>
      <Paper headline={t('user_profile')} classes={['sm']}>
        <Debug data={filter} />
        <form onSubmit={handleSubmit} className={style.form}>
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
      </Paper>
    </div>
  )
}

export default Settings
