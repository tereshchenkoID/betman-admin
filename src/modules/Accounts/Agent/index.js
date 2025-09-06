import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'helpers/api'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import Toggle from 'components/Toggle'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'
import Select from "../../../components/Select";

const Agent = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const initialValue = {
    id: data.id,
    parent_agent: '',
    name: '',
    admin_username: '',
    admin_password: '',
    unlimited_balance: '0',
    currency: 'UAH',
    can_create_sub_agents: '0',
  }
  const [filter, setFilter] = useState(initialValue)
  const [loading, setLoading] = useState(true)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleParentAgent = (value) => {
    setFilter(prev => ({
      ...prev,
      parent_agent: value,
      // ...DATA[value]
    }))
    setLoading(false)
  }

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  // TODO change url
  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    postData(`new-cashier`, formData).then(json => {
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

  return (
    <form className={style.block} onSubmit={handleSubmit}>
      <Debug data={filter} />
      <Select
        placeholder={t('parent_agent')}
        options={[
          { value: '0', label: 'Agent 1' },
          { value: '1', label: 'Agent 2' },
          { value: '2', label: 'Agent 3' },
        ]}
        data={filter.parent_agent}
        onChange={value => {
          handleParentAgent(value)
        }}
      />
      <Field
        type={'text'}
        placeholder={t('name')}
        data={filter.name}
        onChange={value => handlePropsChange('name', value)}
        isRequired={true}
      />
      <Field
        type={'text'}
        placeholder={t('admin_username')}
        data={filter.login}
        onChange={value => handlePropsChange('admin_username', value)}
        isRequired={true}
      />
      <GeneratePassword
        list={['admin_password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <Toggle
        placeholder={t('unlimited_balance')}
        data={filter.unlimited_balance}
        onChange={value => handlePropsChange('unlimited_balance', value)}
        isRequired={true}
      />
      <Field
        type={'text'}
        placeholder={t('currency')}
        data={filter.currency}
        onChange={value => handlePropsChange('currency', value)}
        isDisabled={true}
      />
      <Toggle
        placeholder={t('can_create_sub_agents')}
        data={filter.can_create_sub_agents}
        onChange={value => handlePropsChange('can_create_sub_agents', value)}
        isRequired={true}
      />
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={['primary']}
          placeholder={t('create')}
        />
        <Button
          type={'reset'}
          placeholder={t('cancel')}
          onChange={handleResetForm}
        />
      </div>
    </form>
  )
}

export default Agent
