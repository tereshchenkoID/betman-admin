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

const INITIAL_FILTER = { code: '' }

const Withdrawal = () => {
  const { t} = useTranslation()
  const { request } = useApi()
  const { updateAuth } = useAuth()
  const [ticket, setTicket] = useState(null)

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('code', filter.code)

    const { credits, voucher, error } = await request(REQUEST_TYPE.POST, 'vouchers/redeem/', formData)

    if (!error) {
      updateAuth({ credits })
      setTicket(voucher)
      setFilter(INITIAL_FILTER)
    }
  }

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      {
        ticket &&
        <Voucher data={ticket} isPaid={true} />
      }
      <Plate
        data={t('notification.enter_code')}
        type={'warning'}
      />
      <Field
        type={'text'}
        placeholder={t('code')}
        data={filter.code}
        onChange={value => handlePropsChange('code', value)}
        isRequired={true}
      />
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={['primary']}
          placeholder={t('withdrawal')}
          isDisabled={filter?.code.length !== 12}
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

export default Withdrawal
