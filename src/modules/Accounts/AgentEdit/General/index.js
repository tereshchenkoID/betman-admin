import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Select from 'components/Select'
import Toggle from 'components/Toggle'
import Field from 'components/Field'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const General = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const initialValue = {
    new_password: '',
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
    formData.append('id', data.id)
    formData.append('username', data.username)

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
        <GeneratePassword
          list={['new_password']}
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
