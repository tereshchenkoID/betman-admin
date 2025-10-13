import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useFilterState } from 'hooks/useFilterState'
import { setCmd } from 'store/actions/cmdAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from 'components/Select'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Withdrawal = ({ mock }) => {
  const { t} = useTranslation()
  const dispatch = useDispatch()
  const { request } = useApi()

  const INITIAL_FILTER = {
    id: mock.id,
    credits: mock.credits,
    currency: -1,
    amount: '',
  }

  const {filter, setFilter, handlePropsChange} = useFilterState(INITIAL_FILTER)
  const isValid = filter?.amount !== '' && Number(filter?.amount) > 0 && Number(filter?.amount) <= Number(filter?.credits?.[filter?.currency] ?? 0)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isValid) return

    const formData = new FormData()
    formData.append('data', JSON.stringify(filter))

    const { data, error } = await request(REQUEST_TYPE.POST, 'withdrawal/', formData)

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
        <Field
          type={'number'}
          placeholder={t('amount')}
          data={filter?.amount}
          onChange={value => handlePropsChange('amount', value)}
          isRequired={true}
        />
      }
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={['primary']}
          placeholder={t('withdrawal')}
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

export default Withdrawal
