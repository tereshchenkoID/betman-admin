import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'

import GeneratePassword from 'modules/GeneratePassword'
import Field from 'components/Field'
import Button from 'components/Button'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const ChangePassword = ({ data }) => {
  const initialValue = {
    id: data.id,
    username: data.username,
    old_password: '',
    new_password: '',
    confirm_password: '',
  }

  const dispatch = useDispatch()
  const { t } = useTranslation()
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

    if (filter['new_password'] !== filter['confirm_password']) {
      dispatch(
        setToastify({
          type: 'error',
          text: t('password_mismatch'),
        }),
      )
    } else {
      const formData = new FormData()
      formData.append('id', filter.id)
      formData.append('username', filter.username)
      formData.append('old_password', filter.old_password)
      formData.append('new_password', filter.new_password)

      postData(`password/`, formData).then(json => {
        if (json.code === '0') {
          dispatch(
            setToastify({
              type: 'success',
              text: json.message,
            }),
          ).then(() => {
            handleResetForm()
            dispatch(setAside(null))
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
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter.username}
        onChange={value => handlePropsChange('username', value)}
        classes={['disabled']}
      />
      <GeneratePassword
        list={['new_password', 'confirm_password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <div className={style.actions}>
        <Button type={'submit'} classes={'primary'} placeholder={t('change')} />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={handleResetForm}
        />
      </div>
    </form>
  )
}

export default ChangePassword
