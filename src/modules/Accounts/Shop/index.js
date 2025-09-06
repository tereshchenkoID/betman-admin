import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'helpers/api'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from "components/Select";
import Toggle from 'components/Toggle'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Shop = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const initialValue = {
    id: data.id,
    name: '',
    username: '',
    password: '',
    confirm_password: '',
    currency: '',
    timeout: '0',
    unlimited_balance: '0',
    auto_print_receipts: '0',
    logout_button_enabled: '0'
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

  const currencyOptions = useMemo(() => {
    return Object.entries({
      UAH: 'UAH',
      USD: 'USD'
    }).map(([key, label]) => ({
      value: key,
      label,
    }))
  }, [])

  // TODO change url
  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    postData(`new-show`, formData).then(json => {
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
        isRequired={true}
        isDisabled={true}
      />
      <Field
        type={'text'}
        placeholder={t('name')}
        data={filter.name}
        onChange={value => handlePropsChange('name', value)}
        isRequired={true}
      />
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter.username}
        onChange={value => handlePropsChange('username', value)}
        isRequired={true}
      />
      <GeneratePassword
        list={['password', 'confirm_password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <CustomSelect
        placeholder={t('currency')}
        options={currencyOptions}
        data={filter.currency}
        onChange={value => handlePropsChange('currency', value)}
      />
      <Field
        type={'number'}
        placeholder={t('players_timeout')}
        data={filter.timeout}
        onChange={value => handlePropsChange('timeout', value)}
      />
      <Toggle
        placeholder={t('unlimited_balance')}
        data={filter.unlimited_balance}
        onChange={(e) => handlePropsChange('unlimited_balance', e)}
      />
      <Toggle
        placeholder={t('auto_print_receipts')}
        data={filter.auto_print_receipts}
        onChange={value => handlePropsChange('auto_print_receipts', value)}
      />
      <Toggle
        placeholder={t('logout_button_enabled')}
        data={filter.logout_button_enabled}
        onChange={value => handlePropsChange('logout_button_enabled', value)}
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
          onChange={handleResetForm}
        />
      </div>
    </form>
  )
}

export default Shop
