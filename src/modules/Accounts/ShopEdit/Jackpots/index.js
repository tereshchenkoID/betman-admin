import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'helpers/api'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Toggle from 'components/Toggle'
import Field from 'components/Field'
import Select from "components/Select"
import Info from "modules/Info"
import Debug from 'modules/Debug'

import style from './index.module.scss'

const DATA = {
  '0': {
    on: '0',
    payout_on: '0',
    expected_bet_value: '0',
    total_win: 0,
    average_percentage: '2.56',
    total_wins: '224000',
    slots: [
      {
        name: 'slot 1 (mini)',
        current_value: '0',
        min_value: '1',
        max_value: '0',
        default_value: '0',
        jackpot: '0',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '12353250'
      },
      {
        name: 'slot 2 (major)',
        current_value: '11',
        min_value: '10',
        max_value: '11',
        default_value: '0',
        jackpot: '1',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '2233250'
      },
      {
        name: 'slot 3 (grand)',
        current_value: '0',
        min_value: '0',
        max_value: '0',
        default_value: '0',
        jackpot: '2',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '250'
      },
      {
        name: 'slot 4 (ultimate)',
        current_value: '0',
        min_value: '0',
        max_value: '0',
        default_value: '0',
        jackpot: '0',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '53250'
      }
    ]
  },
  '1': {
    on: '0',
    payout_on: '0',
    expected_bet_value: '0',
    total_win: 0,
    average_percentage: '2.56',
    total_wins: '224000',
    slots: [
      {
        name: 'slot 1 (mini)',
        current_value: '0',
        min_value: '1',
        max_value: '0',
        default_value: '0',
        jackpot: '0',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '53250'
      },
      {
        name: 'slot 2 (major)',
        current_value: '0',
        min_value: '0',
        max_value: '0',
        default_value: '0',
        jackpot: '1',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '23250'
      },
      {
        name: 'slot 3 (grand)',
        current_value: '0',
        min_value: '0',
        max_value: '0',
        default_value: '0',
        jackpot: '2',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '250'
      },
      {
        name: 'slot 4 (ultimate)',
        current_value: '0',
        min_value: '0',
        max_value: '0',
        default_value: '0',
        jackpot: '0',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '53250'
      }
    ]
  },
  '2': {
    on: '0',
    payout_on: '0',
    expected_bet_value: '0',
    total_win: 0,
    average_percentage: '2.56',
    total_wins: '224000',
    slots: [
      {
        name: 'slot 1 (mini)',
        current_value: '0',
        min_value: '1',
        max_value: '0',
        default_value: '0',
        jackpot: '0',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '53250'
      },
      {
        name: 'slot 2 (major)',
        current_value: '0',
        min_value: '0',
        max_value: '0',
        default_value: '0',
        jackpot: '1',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '23250'
      },
      {
        name: 'slot 3 (grand)',
        current_value: '0',
        min_value: '0',
        max_value: '0',
        default_value: '0',
        jackpot: '2',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '250'
      },
      {
        name: 'slot 4 (ultimate)',
        current_value: '0',
        min_value: '0',
        max_value: '0',
        default_value: '0',
        jackpot: '0',
        cooldown: '0',
        expected_number_pieces: '0',
        total_wins: '53250'
      }
    ]
  }
}

const Jackpots = ({ data }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const initialValue = {
    enabled: '0',
    jackpot_template: '',
  }

  const [filter, setFilter] = useState(initialValue)
  const [loading, setLoading] = useState(true)

  const handlePropsChange = (fieldName, fieldValue, slotIndex = null) => {
    setFilter(prev => {
      if (slotIndex !== null) {
        const updatedSlots = [...prev.slots]
        updatedSlots[slotIndex] = {
          ...updatedSlots[slotIndex],
          [fieldName]: fieldValue,
        }
        return {
          ...prev,
          slots: updatedSlots,
        }
      }

      return {
        ...prev,
        [fieldName]: fieldValue,
      }
    })
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

  const handleTemplate = (value) => {
    setFilter(prev => ({
      ...prev,
      jackpot_template: value,
      ...DATA[value]
    }))
    setLoading(false)
  }

  return (
    <>
      <Debug data={filter} />
      <form className={style.block} onSubmit={handleSubmit}>
        <div className={style.row}>
          <div className={style.label}>
            {t('enabled')}:
            <Info
              tooltip={'Test tooltip'}
              place={'bottom'}
            />
          </div>
          <Toggle
            data={filter.enabled}
            onChange={(e) => handlePropsChange('enabled', e)}
          />
        </div>
        {
          filter.enabled === '1' &&
          <>
            <Select
              placeholder={t('jackpot_template')}
              options={[
                { value: '0', label: 'Template 1' },
                { value: '1', label: 'Template 2' },
                { value: '2', label: 'Template 3' },
              ]}
              data={filter.jackpot_template}
              onChange={value => {
                handleTemplate(value)
              }}
            />
            {
              !loading &&
              <>
                <div className={style.row}>
                  <div className={style.label}>
                    {t('on')}:
                    <Info
                      tooltip={'Test tooltip'}
                      place={'bottom'}
                    />
                  </div>
                  <Toggle
                    data={filter.on}
                    onChange={(e) => handlePropsChange('on', e)}
                  />
                </div>
                <div className={style.row}>
                  <div className={style.label}>
                    {t('payout_on')}:
                    <Info
                      tooltip={'Test tooltip'}
                      place={'bottom'}
                    />
                  </div>
                  <Toggle
                    data={filter.payout_on}
                    onChange={(e) => handlePropsChange('payout_on', e)}
                  />
                </div>
                <Field
                  type={'number'}
                  placeholder={t('expected_bet_value')}
                  data={filter.expected_bet_value}
                  onChange={value => handlePropsChange('expected_bet_value', value)}
                />
                <div className={style.table}>
                  <div className={style.header}>
                    <div />
                    {
                      filter.slots?.map((el, idx) =>
                        <div key={idx}>{t(el.name)}</div>
                      )
                    }
                  </div>
                  <div className={style.row}>
                    <div className={style.column}>
                      <div className={style.label}>
                        {t('current_value')}:
                        <Info
                          tooltip={'Test tooltip'}
                          place={'bottom'}
                        />
                      </div>
                      <div className={style.label}>
                        {t('min_value')}:
                        <Info
                          tooltip={'Test tooltip'}
                          place={'bottom'}
                        />
                      </div>
                      <div className={style.label}>
                        {t('max_value')}:
                        <Info
                          tooltip={'Test tooltip'}
                          place={'bottom'}
                        />
                      </div>
                      <div className={style.label}>
                        {t('default_value')}:
                        <Info
                          tooltip={'Test tooltip'}
                          place={'bottom'}
                        />
                      </div>
                      <div className={style.label}>
                        {t('jackpot')}:
                        <Info
                          tooltip={'Test tooltip'}
                          place={'bottom'}
                        />
                      </div>
                      <div className={style.label}>
                        {t('cooldown')}:
                        <Info
                          tooltip={'Test tooltip'}
                          place={'bottom'}
                        />
                      </div>
                      <div className={style.label}>
                        {t('expected_number_pieces')}:
                        <Info
                          tooltip={'Test tooltip'}
                          place={'bottom'}
                        />
                      </div>
                      <div className={style.label}>{t('total_wins')}:</div>
                    </div>
                    {
                      filter.slots?.map((el, idx) =>
                        <div
                          key={idx}
                          className={style.column}
                        >
                          <div className={style.value}>{el.current_value}</div>
                            <Field
                              type='number'
                              data={el.min_value}
                              classes={['sm']}
                              onChange={value => handlePropsChange('min_value', value, idx)}
                            />
                            <Field
                              type='number'
                              data={el.max_value}
                              classes={['sm']}
                              onChange={value => handlePropsChange('max_value', value, idx)}
                            />
                            <Field
                              type='number'
                              data={el.default_value}
                              classes={['sm']}
                              onChange={value => handlePropsChange('default_value', value, idx)}
                            />
                            <div className={style.value}>
                              <Toggle
                                data={el.jackpot}
                                onChange={value => handlePropsChange('jackpot', value, idx)}
                              />
                            </div>
                            <Field
                              type='number'
                              data={el.cooldown}
                              classes={['sm']}
                              onChange={value => handlePropsChange('cooldown', value, idx)}
                            />
                            <Field
                              type='number'
                              data={el.expected_number_pieces}
                              classes={['sm']}
                              onChange={value => handlePropsChange('expected_number_pieces', value, idx)}
                            />
                          <div className={style.value}>{el.total_wins}</div>
                        </div>
                      )
                    }
                    <div className={style.column}>
                      <div className={style.label}>{t('total_wins')} Σ:</div>
                      <div className={style.label}>{t('average_percentage')}:</div>
                    </div>
                    <div className={style.column}>
                      <div className={style.value}>{filter.total_wins}</div>
                      <div className={style.value}>{filter.average_percentage}%</div>
                    </div>
                  </div>
                </div>
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
              </>
            }
          </>
        }
      </form>
    </>
  )
}

export default Jackpots
