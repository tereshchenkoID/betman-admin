import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useAuth } from 'hooks/useAuth'
import { useFilterState } from 'hooks/useFilterState'

import Field from 'components/Field'
import Button from 'components/Button'
import Plate from 'components/Plate'
import Voucher from 'modules/Voucher'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const INITIAL_FILTER = { amount: '' }

const Deposit = () => {
  const { t} = useTranslation()
  const { request } = useApi()
  const { auth, updateAuth } = useAuth()
  const [ticket, setTicket] = useState(null)

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('amount', filter.amount)

    const { credits, voucher, error } = await request(REQUEST_TYPE.POST, 'vouchers/create/', formData)

    if (!error) {
      updateAuth({ credits })
      setTicket(voucher)
      setFilter(INITIAL_FILTER)
    }
  }

  const isValid = (Number(filter.amount) >= auth?.voucher?.deposit?.min) && (Number(filter.amount) <= auth?.voucher?.deposit?.max)

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      {
        ticket &&
        <Voucher data={ticket} />
      }
      <Plate
        data={t(`${t('deposit')} ${t('amount')} ${t('min')}:${auth?.voucher?.deposit?.min}, ${t('max')}:${auth?.voucher?.deposit?.max}`)}
        type={'warning'}
      />
      <Field
        type={'number'}
        placeholder={t('amount')}
        data={filter.amount}
        onChange={value => handlePropsChange('amount', value)}
        isRequired={true}
      />
      <div className={style.actions}>
        {
          auth?.voucher?.deposit?.quickAmount.map((el, idx) =>
            <Button
              key={idx}
              placeholder={`-${el} ${auth.currency.code}`}
              classes={['primary', style.number]}
              onChange={() => handlePropsChange('amount', el)}
            />
          )
        }
      </div>
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={['primary']}
          placeholder={t('deposit')}
          isDisabled={!isValid}
        />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={() => setFilter(INITIAL_FILTER)}
        />
      </div>
    </form>
  )
}

export default Deposit
