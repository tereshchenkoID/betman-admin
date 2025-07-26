import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Withdrawal = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { withdrawal } = useSelector(state => state.withdrawal)
  const initialValue = {
    parent_id: data.id,
    parent_username: data.username,
    player: '',
    amount: null,
  }
  const [filter, setFilter] = useState(initialValue)
  const [inherit, setInherit] = useState(null)
  const list = withdrawal

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

    const formData = new FormData()
    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    postData(`new/${data.type.toLowerCase()}/`, formData).then(json => {
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

  const handleInherit = () => {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('type', data.type.toLowerCase())

    postData(`inherit/`, formData).then(json => {
      if (json.status === 'OK') {
        setInherit(json.data)

        initialValue.country = json.data.country
        initialValue.currency = json.data.currency
        initialValue.web_players_allowed = json.data.web_players_allowed
        initialValue.children_creation_allowed =
          json.data.children_creation_allowed

        setFilter(() => initialValue)
      }
    })
  }

  useEffect(() => {
    handleInherit()
  }, [])

  if (!inherit) return

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

export default Withdrawal
