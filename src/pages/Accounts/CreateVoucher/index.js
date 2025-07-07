import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { types } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'
import { updateAgents } from 'store/actions/agentsAction'
import { searchById } from 'helpers/searchById'

import Field from 'components/Field'
import Button from 'components/Button'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const CreateVoucher = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)
  const initialValue = {
    parent_id: data.id,
    parent_username: data.username,
    initial_balance: null,
  }
  const [filter, setFilter] = useState(initialValue)
  const [inherit, setInherit] = useState(null)
  const list = agents
  const find = useMemo(() => searchById(list[0], data.id), [])

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

    if (filter.new_password !== filter.confirm_password) {
      dispatch(
        setToastify({
          type: 'error',
          text: t('password_mismatch'),
        }),
      )
    } else if (
      filter.new_password.length < 3 ||
      filter.confirm_password.length < 3
    ) {
      dispatch(
        setToastify({
          type: 'error',
          text: t('password_must_length'),
        }),
      )
    } else {
      const formData = new FormData()
      Object.entries(filter).map(([key, value]) => {
        formData.append(key, value)
        return true
      })

      console.log(find)

      postData(`new/${data.type.toLowerCase()}/`, formData).then(json => {
        if (json.status === 'OK') {
          dispatch(
            setToastify({
              type: 'success',
              text: json.message,
            }),
          ).then(() => {
            handleResetForm()

            if (find.length > 0) {
              if (data.type === types.TYPE[0]) {
                if(!find[0].clients) {
                  find[0].clients = [];
                }
                find[0].clients.push(json.data)
              } else {
                find[0].shops.push(json.data)
              }

              dispatch(updateAgents(list))
            }

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
        type={'number'}
        placeholder={t('initial_balance_label')}
        data={filter.initial_balance}
        onChange={value => handlePropsChange('initial_balance', value)}
        required={true}
      />
      <div className={style.actions}>
        <Button type={'submit'} classes={'primary'} placeholder={t('create')} />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={handleResetForm}
        />
      </div>
    </form>
  )
}

export default CreateVoucher
