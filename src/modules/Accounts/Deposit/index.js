import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useAuth } from 'hooks/useAuth'
import { useFilterState } from 'hooks/useFilterState'
import { setCmd } from 'store/actions/cmdAction'
import { setAside } from 'store/actions/asideAction'

import { useOptions } from 'hooks/useOptions'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from 'components/Select'
import Plate from 'components/Plate'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Deposit = ({ mock }) => {
  const { t} = useTranslation()
  const dispatch = useDispatch()
  const { request } = useApi()
  const { auth } = useAuth()

  const INITIAL_FILTER = {
    id: mock.id,
    bonus: -1,
    credits: mock.credits,
    currency: -1,
    amount: '',
  }

  const {filter, setFilter, handlePropsChange} = useFilterState(INITIAL_FILTER)

  const isValid = filter?.amount !== '' && Number(filter?.amount) > 0 && (
    auth.unlimited_balance === '1' || Number(filter?.amount) <= Number(auth.credits[filter?.currency])
  )

  // const { options: bonusOptions } = useOptions(
  //   'agents_tree/',
  //   el => ({ value: el.id, label: el.username }),
  //   [{ value: -1, label: t('select_from_list') }]
  // )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isValid) return

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, error } = await request(REQUEST_TYPE.POST, 'deposit/', formData)

    if (!error) {
      dispatch(setAside(null))
      // setFilter(data)
      dispatch(setCmd('refresh-table'))
    }
  }

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter}/>
      <Field
        type={'text'}
        placeholder={t('id')}
        data={filter?.id}
        isRequired={true}
        isDisabled={true}
      />
      <CustomSelect
        placeholder={t('credits')}
        options={[
          {value: -1, label: t('select_from_list')},
          ...Object.entries(mock?.credits).map(([key, value]) => ({
            value: key,
            label: `${value} ${key}`
          }))
        ]}
        data={filter?.currency}
        onChange={value => {
          handlePropsChange('currency', value)
          handlePropsChange('amount', '')
        }}
        isRequired={true}
      />
      {
        filter?.currency !== -1 &&
        <>
          {
            auth.unlimited_balance !== '1' && Number(filter?.amount) > Number(auth.credits[filter?.currency]) &&
            <Plate data={t('notification.amount_greater_balance')} />
          }
          <Field
            type={'number'}
            placeholder={t('amount')}
            data={filter?.amount}
            onChange={value => handlePropsChange('amount', value)}
            isRequired={true}
          />
        </>
      }
      {/*<CustomSelect*/}
      {/*  placeholder={t('bonus')}*/}
      {/*  options={bonusOptions}*/}
      {/*  data={filter.bonus}*/}
      {/*  onChange={value => handlePropsChange('bonus', value)}*/}
      {/*/>*/}
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
