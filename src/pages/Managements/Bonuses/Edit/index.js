import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { buildFormData } from 'helpers/buildFormData'
import { convertOptions } from 'helpers/convertOptions'
import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { useFilterState } from 'hooks/useFilterState'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Tab from 'components/Tab'
import Debug from 'modules/Debug'
import Breadcrumbs from 'modules/Breadcrumbs'
import CustomSelect from 'components/Select'
import Redactor from 'components/Redactor'
import Checkbox from 'components/Checkbox'
import Bonus from './Bonus'
import FreeSpin from './FreeSpin'
import BonusFixed from './BonusFixed'
import RiskSpin from './RiskSpin'
import Cashback from './Cashback'

import style from './index.module.scss'

const BONUS_COMPONENTS = {
  0: Bonus,
  1: BonusFixed,
  2: FreeSpin,
  3: RiskSpin,
  4: Cashback
}

const Edit = ({ id }) => {
  const { t } = useTranslation()
  const isAdd = id === 'add'
  const navigate = useNavigate()
  const { settings } = useSelector(state => state.settings)
  const { request } = useApi()

  const INITIAL_FILTER = {
    id: null,
    type: -1,
    status: 0,
    created: null,
    updated: null,
    budget: '',
    currency: -1,
    period: {
      type: -1,
      from: '',
      to: ''
    },
    agent: -1,
    bonuses: {
      bonus: {
        enable: '0',
        percentage: '',
        max: '',
        currency: -1,
        wager: ''
      },
      bonus_fixed: {
        enable: '0',
        amount: '',
        currency: -1,
        wager: ''
      },
      free_spins: {
        enable: '0',
        numbers: '',
        stake_level: '',
        providers: [],
        games: [],
        wager: ''
      },
      risk_spins: {
        enable: '0',
        numbers: '',
        stake_level: '',
        providers: [],
        games: [],
        wager: ''
      },
      cashback: {
        enable: '0',
        percentage: '',
        min_loses: '',
        max: '',
        wager: ''
      }
    },
    triggers: [],
    translations: Object.values(settings.site_languages).reduce((acc, lang) => {
      acc[lang.code] = {
        name: '',
        title: '',
        description: '',
      }
      return acc
    }, {}),
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)
  const [active, setActive] = useState(Object.values(settings?.site_languages)[0]?.code)
  const [component, setComponent] = useState(null)
  const [components, setComponents] = useState([])
  const currentTranslation = filter?.translations?.[active]

  const handleResetForm = () => {
    if(isAdd) {
      setFilter(INITIAL_FILTER)
    }
    else {
      handleLoad()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = buildFormData(filter)

    const { data, error } = await request(REQUEST_TYPE.POST, `bonus/${isAdd ? 'add' : 'edit'}`, formData)

    if (!error) {
      setFilter(data)

      if (isAdd) {
        navigate(NAVIGATION.managements.bonuses.link)
      }
    }
  }

  const handleLoad = async () => {
    const { data } = await request(REQUEST_TYPE.GET, `bonus/${id}`)
    setFilter(data)

    handleComponents(data?.type)
  }

  const handleComponents = async (id) => {
    const { data } = await request(REQUEST_TYPE.GET, `get_bonus_types/${id}`)

    setComponents(data.map(e => [e, settings.bonuses.components[e]]))
  }

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  useEffect(() => {
    if(!isAdd) {
      handleLoad()
    }
  }, [])

  const bonusKey = component ? settings.bonuses.components[component] : null
  const bonusData = bonusKey ? filter.bonuses[bonusKey] : null
  const Comp = component ? BONUS_COMPONENTS[component] : null

  return (
    <>
      <Breadcrumbs
        data={[
          NAVIGATION.home,
          NAVIGATION.managements.bonuses,
        ]}
        current={{text: isAdd ? 'add' : `${t('edit')} ${id}`}}
      />
      <Paper
        classes={['sm']}
        headline={isAdd ? t('add') : `${t('edit')}: ${id}`}
      >
        <Debug data={filter} />
        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.column}>
            <CustomSelect
              placeholder={t('type')}
              options={convertOptions(settings.bonuses.types, t)}
              data={filter?.type}
              onChange={value => {
                handlePropsChange('type', value)
                handleComponents(value)
                setComponent(null)
              }}
              isRequired={true}
            />
            {
              filter?.type !== -1 &&
              <>
                <CustomSelect
                  placeholder={t('agent')}
                  options={agentsOptions}
                  data={filter.agent}
                  onChange={value => handlePropsChange('agent', value)}
                />
                <CustomSelect
                  placeholder={t('status')}
                  options={convertOptions(settings.bonuses.statuses, t)}
                  data={filter?.status}
                  onChange={value => handlePropsChange('status', value)}
                  isRequired={true}
                />
                <div className={style.grid}>
                  <Field
                    type={'number'}
                    placeholder={t('budget')}
                    data={filter.budget}
                    onChange={value => handlePropsChange('budget', value)}
                    isRequired={true}
                  />
                  <CustomSelect
                    placeholder={t('currency')}
                    options={[
                      { value: -1, label: t('select_from_list') },
                      ...Object.entries(settings?.currencies).map(([key, el], index) => ({
                        value: key,
                        label: el.text
                      }))
                    ]}
                    isRequired={true}
                    data={filter.currency}
                    onChange={value => handlePropsChange('currency', value)}
                  />
                </div>
                <CustomSelect
                  placeholder={t('period')}
                  options={[
                    { value: -1, label: t('select_from_list') },
                    ...convertOptions(settings.bonuses.periods, t)
                  ]}
                  data={filter?.period?.type}
                  onChange={value => handlePropsChange('period.type', value)}
                  isRequired={true}
                />
                {
                  filter?.period?.type === -1 &&
                  <div className={style.grid}>
                    <Field
                      type={'datetime-local'}
                      placeholder={t('from')}
                      data={filter.period.from}
                      onChange={value => handlePropsChange('period.from', value)}
                    />
                    <Field
                      type={'datetime-local'}
                      placeholder={t('to')}
                      data={filter.period.to}
                      onChange={value => handlePropsChange('period.to', value)}
                    />
                  </div>
                }

                <p>{t('triggers')}:</p>
                <div className={style.list}>
                  {
                    Object.entries(settings.bonuses.triggers).map(([key, value]) => {
                      const isActive = filter?.triggers.includes(key)

                      return (
                        <Button
                          key={key}
                          classes={[isActive ? 'primary' : 'secondary']}
                          placeholder={t(value)}
                          onClick={() => {
                            handlePropsChange(
                              'triggers',
                              isActive
                                ? filter.triggers.filter(t => t !== key)
                                : [...filter.triggers, key]
                            )
                          }}
                        />
                      )
                    })
                  }
                </div>
                <Tab
                  data={component}
                  action={setComponent}
                  options={components}
                />
                {
                  component &&
                  <>
                    <Checkbox
                      placeholder={t('enable')}
                      data={filter.bonuses[bonusKey].enable}
                      onChange={value => handlePropsChange(`bonuses.${bonusKey}.enable`, value)}
                      isRequired={true}
                    />
                    {
                      bonusData.enable === '1' && Comp && (
                        <Comp
                          active={`bonuses.${bonusKey}`}
                          data={bonusData}
                          action={handlePropsChange}
                        />
                      )
                    }
                  </>
                }
              </>
            }
          </div>
          <div className={style.column}>
            <Tab
              data={active}
              action={setActive}
              options={Object.entries(
                Object.fromEntries(
                  Object.values(settings.site_languages).map((item, _) => [
                    item.code,
                    item.code,
                  ])
                )
              )}
            />
            <div className={style.grid}>
              <Field
                type={'text'}
                placeholder={t('name')}
                data={currentTranslation?.name}
                onChange={value => handlePropsChange(`translations.${active}.name`, value)}
                isRequired={true}
              />
              <Field
                type={'text'}
                placeholder={t('title')}
                data={currentTranslation?.title}
                onChange={value => handlePropsChange(`translations.${active}.title`, value)}
                isRequired={true}
              />
            </div>
            <Redactor
              key={active}
              data={currentTranslation?.description}
              action={(value) => handlePropsChange(`translations.${active}.description`, value)} />
            <div className={style.actions}>
              <Button
                type={'submit'}
                classes={['primary']}
                placeholder={t('save')}
              />
              <Button
                type={'reset'}
                placeholder={t('cancel')}
                onChange={handleResetForm}
              />
            </div>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default Edit;
