import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import classNames from 'classnames'

import { postData } from 'hooks/useRequest'
import { convertOptions } from 'helpers/convertOptions'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Checkbox from 'components/Checkbox'
import Label from 'components/Label'
import Select from 'components/Select'
import Field from 'components/Field'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const generateOptions = count => {
  const options = {}
  for (let i = 0; i < count; i++) {
    options[i] = i < 10 ? `0${i}` : `${i}`
  }

  return options
}

const Jackpot = ({ data, currency, inherit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { settings } = useSelector(state => state.settings)
  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const isDisabled = inherit === '1'

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleCheckboxChange = (fieldName, checked, fieldValue) => {
    const newDate = filter.games_allowed

    if (checked === '1') {
      newDate[fieldName] = fieldValue
    } else {
      delete newDate[fieldName]
    }

    setFilter(prevData => ({
      ...prevData,
      games_allowed: newDate,
    }))
  }

  const handleResetForm = () => {
    handleJackpot()
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('currency', currency)
    formData.append('data', JSON.stringify(filter))
    formData.append('inherit', inherit)
    formData.append('jackpot', active + 1)

    postData('accounts/edit/jackpots/', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
        handleJackpot()
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

  const handleJackpot = () => {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('currency', currency)
    formData.append('jackpot', active + 1)

    postData('settings/jp/', formData).then(json => {
      if (json.status === 'OK') {
        setFilter(json.data)
        setLoading(false)
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
    if (active !== 0) {
      setActive(0)
    }
  }, [currency])

  useEffect(() => {
    handleJackpot()
  }, [active])

  if (loading) return

  return (
    <>
      <Debug data={filter} />
      <form className={style.block} onSubmit={handleSubmit}>
        <div className={style.jackpots}>
          {['jackpot_1', 'jackpot_2', 'jackpot_3'].map((el, idx) => (
            <button
              key={idx}
              type={'button'}
              className={classNames(
                style.jackpot,
                active === idx && style.active,
              )}
              onClick={() => setActive(idx)}
            >
              {t(el)}
            </button>
          ))}
        </div>
        <Field
          type={'number'}
          placeholder={t('charge_share')}
          data={filter.charge_share}
          onChange={value => handlePropsChange('charge_share', value)}
          classes={[isDisabled && 'disabled']}
        />
        <Field
          type={'number'}
          placeholder={t('low_limit_amount')}
          data={filter.low_limit_amount}
          onChange={value => handlePropsChange('low_limit_amount', value)}
          classes={[isDisabled && 'disabled']}
        />
        <Field
          type={'number'}
          placeholder={t('high_limit_amount')}
          data={filter.high_limit_amount}
          onChange={value => handlePropsChange('high_limit_amount', value)}
          classes={[isDisabled && 'disabled']}
        />
        <Field
          type={'number'}
          placeholder={t('min_shown_amount')}
          data={filter.min_shown_amount}
          onChange={value => handlePropsChange('min_shown_amount', value)}
          classes={[isDisabled && 'disabled']}
        />
        <Field
          type={'number'}
          placeholder={t('min_stake_win')}
          data={filter.min_stake_win}
          onChange={value => handlePropsChange('min_stake_win', value)}
          classes={[isDisabled && 'disabled']}
        />
        <div>
          <Label placeholder={t('draw_interval')} />
          <div className={style.list}>
            <Select
              placeholder={t('hours')}
              options={convertOptions(generateOptions(24))}
              data={filter.from_hours}
              onChange={value => handlePropsChange('from_hours', value)}
              classes={[isDisabled && 'disabled']}
            />
            <Select
              placeholder={t('minutes')}
              options={convertOptions(generateOptions(60))}
              data={filter.from_minutes}
              onChange={value => handlePropsChange('from_minutes', value)}
              classes={[isDisabled && 'disabled']}
            />
            <Select
              placeholder={t('hours')}
              options={convertOptions(generateOptions(24))}
              data={filter.to_hours}
              onChange={value => handlePropsChange('to_hours', value)}
              classes={[isDisabled && 'disabled']}
            />
            <Select
              placeholder={t('minutes')}
              options={convertOptions(generateOptions(60))}
              data={filter.to_minutes}
              onChange={value => handlePropsChange('to_minutes', value)}
              classes={[isDisabled && 'disabled']}
            />
          </div>
        </div>
        <Field
          type={'number'}
          placeholder={t('jackpot_display_period')}
          data={filter.jackpot_display_period}
          onChange={value => handlePropsChange('jackpot_display_period', value)}
          classes={[isDisabled && 'disabled']}
        />
        <div>
          <Label placeholder={t('games_allowed')} />
          <div className={style.list}>
            {Object.entries(settings.games).map(([key, values]) => (
              <Checkbox
                key={key}
                data={filter.games_allowed[key] ? '1' : '0'}
                placeholder={values}
                onChange={value => handleCheckboxChange(key, value, values)}
                classes={[isDisabled && 'disabled']}
              />
            ))}
          </div>
        </div>
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

export default Jackpot
