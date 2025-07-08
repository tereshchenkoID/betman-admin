import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { types, service } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { convertOptions } from 'helpers/convertOptions'
import { setToastify } from 'store/actions/toastifyAction'
import { setAgents } from 'store/actions/agentsAction'

import Field from 'components/Field'
import Button from 'components/Button'
import Select from 'components/Select'
import Textarea from 'components/Textarea'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const General = ({ data, inherit, setUpdate }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { settings } = useSelector(state => state.settings)
  const [filter, setFilter] = useState({
    inherit: inherit,
    ...data.general
  })
  const isDisabled = inherit === '1'

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }
  const handleResetForm = () => {
    setFilter(data.general)
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

    postData('accounts/edit/general/', formData).then(json => {
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

  useEffect(() => {
    handlePropsChange('inherit', inherit)
  }, [inherit])

  return (
    <>
      <Debug data={filter} />
      <form className={style.block} onSubmit={handleSubmit}>
        <Field
          type={'text'}
          placeholder={t('username')}
          data={data.username}
          onChange={value => handlePropsChange('username', value)}
          classes={['disabled']}
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
          options={Object.entries(service.COUNTRIES).map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          data={filter.country}
          onChange={value => handlePropsChange('country', value)}
        />
        {data.type === types.TYPE[0] && (
          <>
            <Select
              placeholder={t('currency')}
              options={settings.currencies.map(item => ({
                value: item,
                label: item,
              }))}
              data={filter.currency}
              onChange={value => handlePropsChange('currency', value)}
              classes={[isDisabled && 'disabled']}
            />
            <Select
              placeholder={t('locked')}
              options={convertOptions(service.YES_NO)}
              data={parseInt(filter.locked, 10)}
              onChange={value => handlePropsChange('locked', value)}
              classes={[isDisabled && 'disabled']}
            />
            <Select
              placeholder={t('children_creation_allowed')}
              options={Object.entries(service.YES_NO).map(([key, value]) => ({
                value: key,
                label: value,
              }))}
              data={filter.children_creation_allowed}
              onChange={value =>
                handlePropsChange('children_creation_allowed', value)
              }
              classes={[isDisabled && 'disabled']}
            />
            <Select
              placeholder={t('web_players_allowed')}
              options={Object.entries(service.YES_NO).map(([key, value]) => ({
                value: key,
                label: value,
              }))}
              data={filter.web_players_allowed}
              onChange={value =>
                handlePropsChange('web_players_allowed', value)
              }
              classes={[isDisabled && 'disabled']}
            />
            <Field
              type={'text'}
              placeholder={t('web_player_url')}
              data={filter.web_player_url}
              onChange={value => handlePropsChange('web_player_url', value)}
              classes={[isDisabled && 'disabled']}
            />
          </>
        )}
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

export default General
