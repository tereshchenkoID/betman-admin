import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { modes } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { convertOptions } from 'helpers/convertOptions'

import Field from 'components/Field'
import Button from 'components/Button'
import Select from 'components/Select'
import Label from 'components/Label'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Stakes = ({ data, currency, inherit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const isDisabled = inherit === '1'

  const handlePropsChange = (group, parent, fieldName, fieldValue) => {
    const newData = filter

    if (parent) {
      newData[group][parent][fieldName] = fieldValue
    } else {
      newData[group][fieldName] = fieldValue
    }

    setFilter(prevData => ({
      ...prevData,
      [group]: newData[group],
    }))
  }

  const handleResetForm = () => {
    handleCurrency()
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('currency', currency)
    formData.append('data', JSON.stringify(filter))
    formData.append('inherit', inherit)

    postData('accounts/edit/stakes/', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
        handleCurrency()
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

  const handleCurrency = () => {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('currency', currency)

    postData('settings/currency/', formData).then(json => {
      if (json.status === 'OK') {
        setFilter(json.data)
        if (!filter) {
          setLoading(false)
        }
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
    handleCurrency()
  }, [currency])

  if (loading) return

  return (
    <>
      <Debug data={filter} />
      <form className={style.block} onSubmit={handleSubmit}>
        {Object.entries(filter).map(([key]) => (
          <div key={key} className={style.group}>
            <h6>{t(key)}</h6>
            {Object.entries(filter[key]).map(([key_g, value_g]) => (
              <div key={key_g}>
                {typeof value_g === 'object' ? (
                  <>
                    <Label placeholder={t(key_g)} />
                    <div className={style.grid}>
                      {Object.entries(value_g).map(([key_i, value_i]) => (
                        <Field
                          key={key_i}
                          type={'number'}
                          placeholder={t(key_i)}
                          data={value_i}
                          onChange={value =>
                            handlePropsChange(key, key_g, key_i, value)
                          }
                          classes={[isDisabled && 'disabled']}
                        />
                      ))}
                    </div>
                  </>
                ) : key_g === 'stake_mode' ? (
                  <Select
                    placeholder={t(key_g)}
                    options={convertOptions(modes.STAKE_MODE)}
                    data={value_g}
                    onChange={value =>
                      handlePropsChange(key, null, key_g, value)
                    }
                    classes={[isDisabled && 'disabled']}
                  />
                ) : (
                  <Field
                    type={'number'}
                    placeholder={t(key_g)}
                    data={value_g}
                    onChange={value =>
                      handlePropsChange(key, null, key_g, value)
                    }
                    classes={[isDisabled && 'disabled']}
                  />
                )}
              </div>
            ))}
          </div>
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

export default Stakes
