import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Field from 'components/Field'
import Button from 'components/Button'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const WithdrawalBalance = ({ data }) => {
  const { t } = useTranslation()
  const initialValue = {
    parent_id: data.id,
    parent_username: data.username,
    player: '',
    amount: null,
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
  }

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <Field
        type={'text'}
        placeholder={t('player')}
        data={filter.player}
        onChange={value => handlePropsChange('player', value)}
        required={true}
        disabled={true}
      />
      <Field
        type={'number'}
        placeholder={t('amount_label')}
        data={filter.amount}
        onChange={value => handlePropsChange('amount', value)}
        required={true}
      />
      <div className={style.actions}>
        <Button type={'submit'} classes={'primary'} placeholder={t('withdraw')} />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={handleResetForm}
        />
      </div>
    </form>
  )
}

export default WithdrawalBalance
