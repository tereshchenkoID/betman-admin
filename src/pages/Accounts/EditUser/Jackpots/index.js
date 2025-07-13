import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import classNames from "classnames";

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAgents } from 'store/actions/agentsAction'

import Button from 'components/Button'
import ToggleSwitch from "components/ToggleSwitch";
import Field from "components/Field";
import Debug from 'modules/Debug'

import style from './index.module.scss'

const DATA = [
  {label: 'current_value', type: 'field', name: 'current_value'},
  {label: 'min_value', type: 'field', name: 'min_value'},
  {label: 'max_value', type: 'field', name: 'max_value'},
  {label: 'reset_value', type: 'field', name: 'reset_value'},
  {label: 'community_jackpots', type: 'toggle', name: 'community_jackpot'},
  {label: 'community_cooldown', type: 'field', name: 'community_cooldown'},
  {label: 'expected_number_pieces', type: 'field', name: 'expected_monthly_pieces'},
  {label: 'total_wins', type: 'field', name: 'total_wins'},
];

const Jackpots = ({ data, inherit, setUpdate }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState([])
  const isDisabled = inherit === '1'
  const [active, setActive] = useState(2)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isPayoutEnabled, setIsPayoutEnabled] = useState(false)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(data.logo)
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

  return (
    <>
      <Debug data={filter}/>
      <form className={style.block} onSubmit={handleSubmit}>
        <ToggleSwitch isOn={isEnabled} handleToggle={toggle} label={t('enabled')}/>
        <ToggleSwitch
          isOn={isPayoutEnabled}
          handleToggle={() => setIsPayoutEnabled(prev => !prev)}
          label={t('payout_enabled')}/>
        <Field
          type={'number'}
          placeholder={t('expected_bet_value')}
          data={filter.expected_bet_value}
          onChange={value => handlePropsChange('expected_bet_value', value)}
          required={true}
        />
        <div className={style.table}>
          <div className={style.header}>
            <div/>
            <div>{t('slot_1')}</div>
            <div>{t('slot_2')}</div>
            <div>{t('slot_3')}</div>
            <div>{t('slot_4')}</div>
          </div>

          {DATA.map((row, rowIndex) => (
            <div className={style.row} key={rowIndex}>
              <div className={style.label}>
                {t(row.label)}
              </div>
              {[0, 1, 2, 3].map(slotIndex => {
                const fieldName = `${row.name}_${slotIndex}`;
                return (
                  <div key={slotIndex}>
                    {row.type === 'field' ? (
                      <Field
                        type="number"
                        disabled={isDisabled}
                        value={filter[fieldName] || ''}
                        onChange={value => handlePropsChange(fieldName, value)}
                      />
                    ) : (
                      <ToggleSwitch
                        isOn={filter[fieldName] || false}
                        handleToggle={() => handlePropsChange(fieldName, !(filter[fieldName] || false))}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <Field
          type={'number'}
          placeholder={t('total_win')}
          data={filter.total_win}
          onChange={value => handlePropsChange('total_win', value)}
          required={true}
        />
        <Field
          type={'number'}
          placeholder={t('avarage_percentage')}
          data={filter.avarage_percentage}
          onChange={value => handlePropsChange('avarage_percentage', value)}
          required={true}
        />
        <div className={style.actions}>
          <Button type={'submit'} classes={'primary'} placeholder={t('save')}/>
        </div>
      </form>
    </>
  )
}

export default Jackpots
