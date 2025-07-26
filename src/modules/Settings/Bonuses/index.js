import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import classNames from 'classnames'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Select from 'components/Select'
import ToggleSwitch from 'components/ToggleSwitch'
import Field from 'components/Field'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Bonuses = ({ data, inherit, setUpdate }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState([])
  const [active, setActive] = useState(2)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isWagerEnabled, setIsWagerEnabled] = useState(false)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    // setFilter(initialValue)
  }

  const toggle = () => setIsEnabled(prev => !prev)

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('inherit', inherit)

    Object.entries(filter).map(([key, value]) => {
      if(typeof value === 'object') {
        formData.append(key, value)
      }
      return true
    })

    postData('accounts/edit/logo/', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
        setUpdate(true)
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
      <Debug data={filter}/>
      <div className={style.header}>
        {/*<button*/}
        {/*  className={classNames(style.link, active === 0 && style.active)}*/}
        {/*  onClick={() => setActive(0)}*/}
        {/*>*/}
        {/*  {t('common')}*/}
        {/*</button>*/}
        {/*<button*/}
        {/*  className={classNames(style.link, active === 1 && style.active)}*/}
        {/*  onClick={() => setActive(1)}*/}
        {/*>*/}
        {/*  {t('auto_issue')}*/}
        {/*</button>*/}
        <button
          className={classNames(style.link, active === 2 && style.active)}
          onClick={() => setActive(2)}
        >
          {t('cashback')}
        </button>
        <button
          className={classNames(style.link, active === 3 && style.active)}
          onClick={() => setActive(3)}
        >
          {t('bounceback')}
        </button>
      </div>
      {/*{active === 0 && (*/}
      {/*  <form className={style.block} onSubmit={handleSubmit}>*/}
      {/*    <div>Common tab form content</div>*/}
      {/*    <div className={style.actions}>*/}
      {/*      <Button type={'submit'} classes={'primary'} placeholder={t('save')} />*/}
      {/*    </div>*/}
      {/*  </form>*/}
      {/*)}*/}

      {/*{active === 1 && (*/}
      {/*  <form className={style.block} onSubmit={handleSubmit}>*/}
      {/*    <div>Auto issue form content</div>*/}
      {/*    <div className={style.actions}>*/}
      {/*      <Button type={'submit'} classes={'primary'} placeholder={t('save')} />*/}
      {/*    </div>*/}
      {/*  </form>*/}
      {/*)}*/}

      {active === 2 && (
        <form className={style.block} onSubmit={handleSubmit}>
          <Select
            placeholder={t('template')}
            options={[
              { value: '0', label: 'Template 1' },
              { value: '1', label: 'Template 2' },
              { value: '2', label: 'Template 3' },
            ]}
            data={filter.template}
            onChange={value => handlePropsChange('template', value)}
          />
          <ToggleSwitch isOn={isEnabled} handleToggle={toggle} label={t('enabled')} />
          <Field
            type={'number'}
            placeholder={t('percentage_deposit')}
            data={filter.percentage_deposit}
            onChange={value => handlePropsChange('percentage_deposit', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('threshold_issue')}
            data={filter.threshold_issue}
            onChange={value => handlePropsChange('threshold_issue', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('min_deposit')}
            data={filter.min_deposit}
            onChange={value => handlePropsChange('min_deposit', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('max_deposit')}
            data={filter.max_deposit}
            onChange={value => handlePropsChange('max_deposit', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('max_activations_per_player')}
            data={filter.max_activations_per_player}
            onChange={value => handlePropsChange('max_activations_per_player', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('cooldown_period')}
            data={filter.cooldown_period}
            onChange={value => handlePropsChange('cooldown_period', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('player_balance_threshold')}
            data={filter.player_balance_threshold}
            onChange={value => handlePropsChange('player_balance_threshold', value)}
            required={true}
          />
          <ToggleSwitch
            isOn={isWagerEnabled}
            handleToggle={() => setIsWagerEnabled(prev => !prev)}
            label={t('wager_enabled')} />
          <div className={style.actions}>
            <Button type={'submit'} classes={'primary'} placeholder={t('save')} />
          </div>
        </form>
      )}

      {active === 3 && (
        <form className={style.block} onSubmit={handleSubmit}>
          <Select
            placeholder={t('template')}
            options={[
              { value: '0', label: 'Template 1' },
              { value: '1', label: 'Template 2' },
              { value: '2', label: 'Template 3' },
            ]}
            data={filter.template}
            onChange={value => handlePropsChange('template', value)}
          />
          <ToggleSwitch isOn={isEnabled} handleToggle={toggle} label={t('enabled')} />
          <Field
            type={'number'}
            placeholder={t('percentage_deposit')}
            data={filter.percentage_deposit}
            onChange={value => handlePropsChange('percentage_deposit', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('threshold_issue')}
            data={filter.threshold_issue}
            onChange={value => handlePropsChange('threshold_issue', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('min_deposit')}
            data={filter.min_deposit}
            onChange={value => handlePropsChange('min_deposit', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('max_deposit')}
            data={filter.max_deposit}
            onChange={value => handlePropsChange('max_deposit', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('max_activations_per_player')}
            data={filter.max_activations_per_player}
            onChange={value => handlePropsChange('max_activations_per_player', value)}
            required={true}
          />
          <Field
            type={'number'}
            placeholder={t('cooldown_period')}
            data={filter.cooldown_period}
            onChange={value => handlePropsChange('cooldown_period', value)}
            required={true}
          />
          <ToggleSwitch
            isOn={isWagerEnabled}
            handleToggle={() => setIsWagerEnabled(prev => !prev)}
            label={t('wager_enabled')} />
          <div className={style.actions}>
            <Button type={'submit'} classes={'primary'} placeholder={t('save')} />
            <Button
              type={'reset'}
              placeholder={t('cancel')}
              onChange={handleResetForm}
            />
          </div>
        </form>
      )}
    </>
  )
}

export default Bonuses
