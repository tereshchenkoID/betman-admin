import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'helpers/api'
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
    unlimited_balance: '0',
    blocked: '0',
    panic: '0',
    panic_url: '',
    block_cashier: '0',
    auto_print_receipts: '0',
    configured_by_parent: '0',
    kyc_type: '',
    shop_games_for_player: '',
    instant_messages: '0',
    new_password: '',
    current_password: ''
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
          list={['new_password', 'current_password']}
          data={filter}
          action={setFilter}
          filter={filter}
          handlePropsChange={handlePropsChange}
        />
        <Toggle
          placeholder={t('unlimited_balance')}
          data={filter.unlimited_balance}
          onChange={(e) => handlePropsChange('unlimited_balance', e)}
        />
        <Toggle
          placeholder={t('blocked')}
          data={filter.blocked}
          onChange={(e) => handlePropsChange('blocked', e)}
        />
        <Toggle
          placeholder={t('panic')}
          data={filter.panic}
          onChange={(e) => handlePropsChange('panic', e)}
        />
        <Field
          placeholder={t('panic_url')}
          data={filter.panic_url}
          onChange={value => handlePropsChange('panic_url', value)}
        />
        <Toggle
          placeholder={t('block_cashier')}
          data={filter.block_cashier}
          onChange={(e) => handlePropsChange('block_cashier', e)}
        />
        <span>{t('currency')}: UAH</span>
        <Toggle
          placeholder={t('auto_print_receipts')}
          data={filter.auto_print_receipts}
          onChange={(e) => handlePropsChange('auto_print_receipts', e)}
        />
        <Toggle
          placeholder={t('configured_by_parent')}
          data={filter.configured_by_parent}
          onChange={(e) => handlePropsChange('configured_by_parent', e)}
        />
        <Select
          placeholder={t('kyc_type')}
          options={[
            { value: '0', label: 'No need' },
            { value: '1', label: 'Manual' },
            { value: '2', label: 'Provider' },
          ]}
          data={filter.kyc_type}
          onChange={value => handlePropsChange('kyc_type', value)}
        />
        <Select
          placeholder={t('shop_games_for_player')}
          options={[
            { value: '0', label: 'Always' },
            { value: '1', label: 'KYC Confirmed' },
            { value: '2', label: 'KYC Confirmed or Deposit' },
          ]}
          data={filter.shop_games_for_player}
          onChange={value => handlePropsChange('shop_games_for_player', value)}
        />
        <Toggle
          placeholder={t('instant_messages')}
          data={filter.instant_messages}
          onChange={(e) => handlePropsChange('instant_messages', e)}
        />
        <div className={style.actions}>
          <Button
            type={'submit'}
            classes={['primary']}
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
