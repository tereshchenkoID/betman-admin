import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'helpers/api'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import Toggle from 'components/Toggle'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Cashier = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const initialValue = {
    id: data.id,
    name: '',
    username: '',
    password: '',
    confirm_password: '',
    shift_mode: '0'
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

    postData(`new-cashier`, formData).then(json => {
      if (json.status === 'OK') {
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

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <Field
        type={'text'}
        placeholder={t('current_id')}
        data={filter.id}
        required={true}
        disabled={true}
      />
      <Field
        type={'text'}
        placeholder={t('name')}
        data={filter.name}
        onChange={value => handlePropsChange('name', value)}
        required={true}
      />
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter.login}
        onChange={value => handlePropsChange('username', value)}
        required={true}
      />
      <GeneratePassword
        list={['password', 'confirm_password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <Toggle
        placeholder={t('shift_mode')}
        data={filter.shift_mode}
        onChange={value => handlePropsChange('shift_mode', value)}
        required={true}
      />
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={'primary'}
          placeholder={t('create')}
        />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={handleResetForm}
        />
      </div>
    </form>
  )
}

export default Cashier
