import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { service, ticket } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { convertOptions } from 'helpers/convertOptions'
import { setToastify } from 'store/actions/toastifyAction'
import { setAgents } from 'store/actions/agentsAction'

import Button from 'components/Button'
import Select from 'components/Select'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Business = ({ data, inherit, setUpdate }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState(data.business)
  const isDisabled = inherit === '1'

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(data.business)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('inherit', inherit)
    formData.append('data', JSON.stringify(filter))

    postData('accounts/edit/business/', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
        setUpdate(true)
        dispatch(setAgents())
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
        {Object.entries(filter).map(([key, value]) => (
          <Select
            key={key}
            placeholder={t(key)}
            options={convertOptions(
              key === 'ticket_payout' ? ticket.PAYOUT : service.ENABLE_DISABLE,
            )}
            data={Number(value)}
            onChange={value => handlePropsChange(key, value)}
            classes={[isDisabled && 'disabled']}
          />
        ))}
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

export default Business
