import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import classNames from 'classnames'

import { postData } from 'helpers/api'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Select from 'components/Select'
import Toggle from 'components/Toggle'
import Field from 'components/Field'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const TABS = [
  'common',
  'auto_issue',
  'cashback',
  'bounceback',
]

const Bonuses = ({ data }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const initialValue = {
    completion_bonus_wager_low_balance: '0',
    min_withdraw: '',
    wager: '',
    auto_issue_bonus_kiosks: '0',
    auto_issue_bonus_strategy: '',
    auto_issue_bonus_psp: '0',
    auto_issue_bonus_strategy_strategy: '',
    has_access: '0',
    template: '',
    enabled: '0',
    percentage_deposit: '0',
    threshold_issue: '0',
    min_deposit: '0',
    max_deposit: '0',
    max_activations_per_player: '0',
    cooldown_period: '0',
    player_balance_threshold: '0',
    wager_enabled: '0',
  }

  const [filter, setFilter] = useState(initialValue)
  const [active, setActive] = useState(0)

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
    formData.append('id', data.id)
    formData.append('username', data.username)

    Object.entries(filter).map(([key, value]) => {
      if(typeof value === 'object') {
        formData.append(key, value)
      }
      return true
    })

    postData('bonus', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
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
        {
          TABS.map((el, idx) =>
            <button
              key={idx}
              className={
                classNames(
                  style.link,
                  active === idx && style.active
                )
              }
              onClick={() => setActive(idx)}
            >
              {t(el)}
            </button>
          )
        }
      </div>
      <form className={style.block} onSubmit={handleSubmit}>
      {
        active === 0 &&
        <>
          <Toggle
            placeholder={t('completion_bonus_wager_low_balance')}
            data={filter.completion_bonus_wager_low_balance}
            onChange={(e) => handlePropsChange('completion_bonus_wager_low_balance', e)}
          />
          <Field
            type={'number'}
            placeholder={t('min_withdraw')}
            data={filter.min_withdraw}
            onChange={value => handlePropsChange('min_withdraw', value)}
          />
          <Field
            type={'number'}
            placeholder={t('wager')}
            data={filter.wager}
            onChange={value => handlePropsChange('wager', value)}
          />
        </>
      }
      {
        active === 1 &&
        <>
          <Toggle
            placeholder={t('auto_issue_bonus_kiosks')}
            data={filter.auto_issue_bonus_kiosks}
            onChange={(e) => handlePropsChange('auto_issue_bonus_kiosks', e)}
          />
          <Select
            placeholder={t('auto_issue_bonus_strategy')}
            options={[
              { value: '0', label: 'None' },
              { value: '1', label: 'Specific bonus' },
              { value: '2', label: 'Deposit depending bonus' },
            ]}
            data={filter.auto_issue_bonus_strategy}
            onChange={value => handlePropsChange('auto_issue_bonus_strategy', value)}
          />
          <Toggle
            placeholder={t('auto_issue_bonus_psp')}
            data={filter.auto_issue_bonus_psp}
            onChange={(e) => handlePropsChange('auto_issue_bonus_psp', e)}
          />
          <Select
            placeholder={t('auto_issue_bonus_psp_strategy')}
            options={[
              { value: '0', label: 'None' },
              { value: '1', label: 'Specific bonus' },
              { value: '2', label: 'Deposit depending bonus' },
            ]}
            data={filter.auto_issue_bonus_psp_strategy}
            onChange={value => handlePropsChange('auto_issue_bonus_psp_strategy', value)}
          />
        </>
      }
      {
        active === 2 &&
        <>
          <Toggle
            placeholder={t('has_access')}
            data={filter.has_access}
            onChange={(e) => handlePropsChange('has_access', e)}
          />
          <Select
            placeholder={t('template')}
            options={[
              { value: '0', label: 'Template 1' },
              { value: '1', label: 'Template 2' },
            ]}
            data={filter.template}
            onChange={value => handlePropsChange('template', value)}
          />
          <Toggle
            placeholder={t('enabled')}
            data={filter.enabled}
            onChange={(e) => handlePropsChange('enabled', e)}
          />
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
          <Toggle
            placeholder={t('wager_enabled')}
            data={filter.wager_enabled}
            onChange={(e) => handlePropsChange('wager_enabled', e)}
          />
        </>
      }
      {
        active === 3 &&
        <>
          <Toggle
            placeholder={t('has_access')}
            data={filter.has_access}
            onChange={(e) => handlePropsChange('has_access', e)}
          />
          <Select
            placeholder={t('template')}
            options={[
              { value: '0', label: 'Template 1' },
              { value: '1', label: 'Template 2' },
            ]}
            data={filter.template}
            onChange={value => handlePropsChange('template', value)}
          />
          <Toggle
            placeholder={t('enabled')}
            data={filter.enabled}
            onChange={(e) => handlePropsChange('enabled', e)}
          />
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
          <Toggle
            placeholder={t('wager_enabled')}
            data={filter.wager_enabled}
            onChange={(e) => handlePropsChange('wager_enabled', e)}
          />
        </>
      }
      <div className={style.actions}>
        <Button
          type={'submit'}
          classes={'primary'}
          placeholder={t('save')}
        />
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

export default Bonuses
