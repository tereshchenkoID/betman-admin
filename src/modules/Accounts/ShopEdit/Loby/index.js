import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Toggle from 'components/Toggle'
import Field from "components/Field";
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Loby = ({ data, inherit, setUpdate }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const initialValue = {
    players_idle_timeout: '0',
    logout_button_enabled: '0',
    jackpot_token: '',
  }

  const [filter, setFilter] = useState({
    inherit: inherit,
    ...data.general
  })

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    // setFilter(initialValue)
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
        <Field
          type={'number'}
          placeholder={t('players_idle_timeout')}
          data={filter.players_idle_timeout}
          onChange={value => handlePropsChange('players_idle_timeout', value)}
        />
        <Toggle
          placeholder={t('logout_button_enabled')}
          data={filter.logout_button_enabled}
          onChange={(e) => handlePropsChange('logout_button_enabled', e)}
        />
        <Field
          placeholder={t('jackpot_token')}
          data={filter.jackpot_token}
          onChange={value => handlePropsChange('jackpot_token', value)}
        />
        <div className={style.actions}>
          <Button type={'submit'} classes={'primary'} placeholder={t('save')} />
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

export default Loby
