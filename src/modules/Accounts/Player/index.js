import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAside } from 'store/actions/asideAction'

import Field from 'components/Field'
import Button from 'components/Button'
import CustomSelect from "components/Select";
import GeneratePassword from 'modules/GeneratePassword'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Player = ({ data }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const initialValue = {
    id: data.id,
    username: '',
    password: '',
    confirm_password: '',
    balance: '0',
    bonus: '',
  }
  const [filter, setFilter] = useState(initialValue)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  const bonusOptions = useMemo(() => {
    return Object.entries({
      cashback: 'cashback',
      bounceback: 'bounceback'
    }).map(([key, label]) => ({
      value: key,
      label,
    }))
  }, [])

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    // TODO change url
    postData(`new-player`, formData).then(json => {
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
      <Field
        type={'text'}
        placeholder={t('username')}
        data={filter.username}
        onChange={value => handlePropsChange('username', value)}
        required={true}
      />
      <GeneratePassword
        list={['password', 'confirm_password']}
        data={filter}
        action={setFilter}
        filter={filter}
        handlePropsChange={handlePropsChange}
      />
      <Field
        type={'balance'}
        placeholder={t('balance')}
        data={filter.balance}
        onChange={value => handlePropsChange('balance', value)}
        required={true}
      />
      <CustomSelect
        placeholder={t('select_bonus')}
        options={bonusOptions}
        data={filter.bonus}
        onChange={value => handlePropsChange('bonus', value)}
      />
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={'primary'}
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

export default Player
