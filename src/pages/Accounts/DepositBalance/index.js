import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from "components/Select";
import Debug from 'modules/Debug'

import style from './index.module.scss'

const DepositBalance = ({ data }) => {
  const { t } = useTranslation()
  const initialValue = {
    parent_id: data.id,
    parent_username: data.username,
    player: '',
    amount: null,
    bonusOptions: {
      cashback: 'cashback',
      bounceback: 'bounceback'
    },
    bonus: '',
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

  const bonusOptions = useMemo(() => {
    return Object.entries(filter.bonusOptions).map(([key, label]) => ({
      value: key,
      label,
    }))
  }, [filter.bonusOptions])

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
      <CustomSelect
        placeholder={t('select_bonus')}
        options={bonusOptions}
        data={filter.bonus}
        onChange={value => handlePropsChange('bonus', value)}
      />
      <div className={style.actions}>
        <Button type={'submit'} classes={'primary'} placeholder={t('deposit')} />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={handleResetForm}
        />
      </div>
    </form>
  )
}

export default DepositBalance
