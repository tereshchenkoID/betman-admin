import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import ToggleSwitch from 'components/ToggleSwitch'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Cashier = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [isShiftMode, setIsShiftMode] = useState(false)
  const { cashier } = useSelector(state => state.cashier)
  const initialValue = {
    parent_id: data.id,
    parent_username: data.username,
    name: '',
    login: '',
    password: '',
  }
  const [filter, setFilter] = useState(initialValue)
  const [inherit, setInherit] = useState(null)
  const list = cashier

  const shiftmode = () => setIsShiftMode(prev => !prev)

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
    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    postData(`new/${data.type.toLowerCase()}/`, formData).then(json => {
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

  const handleInherit = () => {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('type', data.type.toLowerCase())

    postData(`inherit/`, formData).then(json => {
      if (json.status === 'OK') {
        setInherit(json.data)

        initialValue.country = json.data.country
        initialValue.currency = json.data.currency
        initialValue.web_players_allowed = json.data.web_players_allowed
        initialValue.children_creation_allowed =
          json.data.children_creation_allowed

        setFilter(() => initialValue)
      }
    })
  }

  useEffect(() => {
    handleInherit()
  }, [])

  if (!inherit) return

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <Field
        type={'text'}
        placeholder={t('name')}
        data={filter.name}
        onChange={value => handlePropsChange('name', value)}
        required={true}
      />
      <Field
        type={'text'}
        placeholder={t('login')}
        data={filter.login}
        onChange={value => handlePropsChange('login', value)}
        required={true}
      />
      <GeneratePassword
        list={['password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <ToggleSwitch isOn={isShiftMode} handleToggle={shiftmode} label={t('shift_mode')} />
      <div className={style.actions}>
        <Button type={'submit'} classes={'primary'} placeholder={t('save')} />
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
