import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from "components/Select";
import ToggleSwitch from 'components/ToggleSwitch'
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Shop = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { shop } = useSelector(state => state.shop)
  const initialValue = {
    parent_id: data.id,
    parent_username: data.username,
    parentAgent: {
      'agent1': 'agent1',
      'agent2': 'agent2',
    },
    agent: '',
    name: '',
    admin_username: '',
    admin_password: '',
    currencyOptions: {
      UAH: 'UAH',
      USD: 'USD'
    },
    currency: '',
    amount: '0',
  }
  const [filter, setFilter] = useState(initialValue)
  const [inherit, setInherit] = useState(null)
  const [isUnlimited, setIsUnlimited] = useState(false)
  const [isPrinted, setIsPrinted] = useState(false)
  const [isLogout, setIsLogout] = useState(false)
  const list = shop

  const unlimited = () => setIsUnlimited(prev => !prev)
  const printed = () => setIsPrinted(prev => !prev)
  const logout = () => setIsLogout(prev => !prev)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  const currencyOptions = useMemo(() => {
    return Object.entries(filter.currencyOptions).map(([key, label]) => ({
      value: key,
      label,
    }))
  }, [filter.currencyOptions])

  const parentAgent = useMemo(() => {
    return Object.entries(filter.parentAgent).map(([key, label]) => ({
      value: key,
      label,
    }))
  }, [filter.parentAgent])

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
      <CustomSelect
        placeholder={t('parent_agent')}
        options={parentAgent}
        data={filter.agent}
        onChange={value => handlePropsChange('agent', value)}
      />
      <Field
        type={'text'}
        placeholder={t('nanme')}
        data={filter.name}
        onChange={value => handlePropsChange('name', value)}
        required={true}
      />
      <Field
        type={'text'}
        placeholder={t('admin_username')}
        data={filter.admin_username}
        onChange={value => handlePropsChange('admin_username', value)}
        required={true}
      />
      <GeneratePassword
        list={['admin_password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <ToggleSwitch isOn={isUnlimited} handleToggle={unlimited} label={t('unlemited_balance')} />
      <CustomSelect
        placeholder={t('select_currency')}
        options={currencyOptions}
        data={filter.currency}
        onChange={value => handlePropsChange('currency', value)}
      />
      <ToggleSwitch isOn={isPrinted} handleToggle={printed} label={t('auto_print_receipts')} />
      <Field
        type={'number'}
        placeholder={t('players_idle_timeout')}
        data={filter.amount}
        onChange={value => handlePropsChange('amount', value)}
        required={true}
      />
      <ToggleSwitch isOn={isLogout} handleToggle={logout} label={t('logout_button_enabled')} />
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

export default Shop
