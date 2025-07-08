import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { types, service } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'
import { updateAgents } from 'store/actions/agentsAction'
import { searchById } from 'helpers/searchById'

import Field from 'components/Field'
import Button from 'components/Button'
import Select from 'components/Select'
import Textarea from 'components/Textarea'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const NewAgent = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { agents } = useSelector(state => state.agents)
  const { settings } = useSelector(state => state.settings)
  const initialValue = {
    parent_id: data.id,
    parent_username: data.username,
    username: '',
    new_password: '',
    confirm_password: '',
    full_name: '',
    email: '',
    description: '',
    country: '',
    currency: '',
    // 'children_creation_allowed': '',
    // 'web_players_allowed': '',
    // 'web_player_url': ''
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
        type={'text'}
        placeholder={t('username')}
        data={filter.username}
        onChange={value => handlePropsChange('username', value)}
        required={true}
      />
      <GeneratePassword
        list={['new_password', 'confirm_password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <Field
        type={'text'}
        placeholder={t('full_name')}
        data={filter.full_name}
        onChange={value => handlePropsChange('full_name', value)}
      />
      <Field
        type={'email'}
        placeholder={t('email')}
        data={filter.email}
        onChange={value => handlePropsChange('email', value)}
      />
      <Textarea
        placeholder={t('description')}
        data={filter.description}
        onChange={value => handlePropsChange('description', value)}
        classes={['lg']}
      />
      <Select
        placeholder={t('country')}
        options={Object.entries(service.COUNTRIES).map(([key, value]) => {
          if (inherit.country === key) {
            return { value: key, label: `${t('inherit')} (${value})` }
          }
          return { value: key, label: value }
        })}
        data={filter.country}
        onChange={value => handlePropsChange('country', value)}
      />
      <Select
        placeholder={t('currency')}
        options={settings.currencies.map(currency => {
          if (currency === inherit.currency) {
            return { value: currency, label: `${t('inherit')} (${currency})` }
          }
          return { value: currency, label: currency }
        })}
        data={filter.currency}
        onChange={value => handlePropsChange('currency', value)}
      />
      {data.type === types.TYPE[0] && (
        <>
          <Select
            placeholder={t('children_creation_allowed')}
            options={Object.entries(service.YES_NO).map(([key, value]) => {
              if (inherit['children_creation_allowed'] === key) {
                return { value: key, label: `${t('inherit')} (${value})` }
              }
              return { value: key, label: value }
            })}
            data={filter.children_creation_allowed}
            onChange={value =>
              handlePropsChange('children_creation_allowed', value)
            }
          />
          <Select
            placeholder={t('web_players_allowed')}
            options={Object.entries(service.YES_NO).map(([key, value]) => {
              if (inherit['web_players_allowed'] === key) {
                return { value: key, label: `${t('inherit')} (${value})` }
              }
              return { value: key, label: value }
            })}
            data={filter.web_players_allowed}
            onChange={value => handlePropsChange('web_players_allowed', value)}
          />
          <Field
            type={'text'}
            placeholder={t('web_player_url')}
            data={filter['web_player_url']}
            onChange={value => handlePropsChange('web_player_url', value)}
          />
        </>
      )}
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

export default NewAgent
