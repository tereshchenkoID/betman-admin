import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { modes, service } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { convertOptions } from 'helpers/convertOptions'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Select from 'components/Select'
import Textarea from 'components/Textarea'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Shop = ({ data, inherit, setUpdate }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState(data.shop)
  const isDisabled = inherit === '1'

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(data.shop)
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

    postData('accounts/edit/shop/', formData).then(json => {
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

  return (
    <>
      <Debug data={filter} />
      <form className={style.block} onSubmit={handleSubmit}>
        <Select
          placeholder={t('language')}
          options={Object.entries(service.LANGUAGES).map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          data={filter.language}
          onChange={value => handlePropsChange('language', value)}
          classes={[isDisabled && 'disabled']}
        />
        <Textarea
          placeholder={t('ticket_text')}
          data={filter.ticket_text}
          onChange={value => handlePropsChange('ticket_text', value)}
          classes={['lg', isDisabled && 'disabled']}
        />
        <Textarea
          placeholder={t('cashier_text')}
          data={filter.cashier_text}
          onChange={value => handlePropsChange('cashier_text', value)}
          classes={['lg', isDisabled && 'disabled']}
        />
        <Select
          placeholder={t('print_cancel_tickets')}
          options={convertOptions(service.ENABLE_DISABLE)}
          data={Number(filter.print_cancel_tickets)}
          onChange={value => handlePropsChange('print_cancel_tickets', value)}
          classes={[isDisabled && 'disabled']}
        />
        <Select
          placeholder={t('printing_mode')}
          options={convertOptions(modes.PRINTING_MODE)}
          data={Number(filter.printing_mode)}
          onChange={value => handlePropsChange('printing_mode', value)}
          classes={[isDisabled && 'disabled']}
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

export default Shop
