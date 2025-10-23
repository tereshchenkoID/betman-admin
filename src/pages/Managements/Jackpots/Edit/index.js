import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { useFilterState } from 'hooks/useFilterState'
import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { buildFormData } from 'helpers/buildFormData'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Uploader from 'components/Uploader'
import CustomSelect from 'components/Select'
import Redactor from 'components/Redactor'
import Tab from 'components/Tab'
import Breadcrumbs from 'modules/Breadcrumbs'
import Providers from 'modules/Providers'
import Debug from 'modules/Debug'
import JackpotCard from './JackpotCard'

import style from './index.module.scss'

const Edit = ({ id }) => {
  const { t } = useTranslation()
  const isAdd = id === 'add'
  const navigate = useNavigate()
  const { request, loading } = useApi()
  const { settings } = useSelector(state => state.settings)

  const INITIAL_FILTER = {
    id: null,
    image: '',
    visibility: 0,
    currency: '',
    share: '',
    low_limit: '',
    high_limit: '',
    min_shown: '',
    min_stake: '',
    draw_interval: '',
    drop_interval: [],
    providers: [],
    games: [],
    agent: -1,
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

    formData.delete('games')
    formData.append('games', JSON.stringify(filter.games.map(el => el)))

    const { data, error } = await request(REQUEST_TYPE.POST, `jackpot/${isAdd ? 'add' : 'edit'}`, formData)

    if (!error) {
      setFilter(data)

      if (isAdd) {
        navigate(NAVIGATION.managements.jackpots.link)
      }
    }
  }

  const handleLoad = async () => {
    const { data } = await request(REQUEST_TYPE.GET, `jackpot/${id}`)
    setFilter(data)
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

  return (
    <>
      <Breadcrumbs
        data={[
          NAVIGATION.home,
          NAVIGATION.managements.jackpots,
        ]}
        current={{text: isAdd ? 'add' : `${t('edit')} ${id}`}}
      />
      <Paper
        classes={['sm']}
        headline={isAdd ? t('add') : `${t('edit')}: ${id}`}
      >
        <Debug data={filter} />
        <div className={style.block}>
          <form className={style.form} onSubmit={handleSubmit}>
            <Uploader
              data={filter?.image}
              onChange={(blob) => handlePropsChange('image', blob)}
            />
            <CustomSelect
              placeholder={t('agent')}
              options={agentsOptions}
              data={filter.agent}
              onChange={value => handlePropsChange('agent', value)}
            />
            {
              !loading &&
              <Providers
                providersSelected={filter.providers}
                gamesSelected={filter.games}
                onChange={(field, value) => handlePropsChange(field, value)}
              />
            }
            <div className={style.grid}>
              <Field
                type={'number'}
                placeholder={t('low_limit')}
                data={filter?.low_limit}
                onChange={value => handlePropsChange('low_limit', value)}
                isRequired={true}
              />
              <Field
                type={'number'}
                placeholder={t('high_limit')}
                data={filter?.high_limit}
                onChange={value => handlePropsChange('high_limit', value)}
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
              <Field
                type={'number'}
                placeholder={t('min_shown')}
                data={filter?.min_shown}
                onChange={value => handlePropsChange('min_shown', value)}
                isRequired={true}
              />
              <Field
                type={'number'}
                placeholder={t('min_stake')}
                data={filter?.min_stake}
                onChange={value => handlePropsChange('min_stake', value)}
                isRequired={true}
              />
              <Field
                type={'number'}
                placeholder={t('share')}
                data={filter?.share}
                onChange={value => handlePropsChange('share', value)}
                isRequired={true}
              />
              <Field
                type={'number'}
                placeholder={t('draw_interval')}
                data={filter?.draw_interval}
                onChange={value => handlePropsChange('draw_interval', value)}
                isRequired={true}
              />
              <Field
                type={'datetime-local'}
                placeholder={t('dropped_date')}
                data={filter?.date_dropped}
                onChange={null}
                isDisabled={true}
              />
              <Field
                type={'datetime-local'}
                placeholder={t('drop_interval_from')}
                data={filter?.drop_interval?.[0]}
                onChange={value => handlePropsChange('drop_interval[0]', value)}
              />
              <Field
                type={'datetime-local'}
                placeholder={t('drop_interval_to')}
                data={filter?.drop_interval?.[1]}
                onChange={value => handlePropsChange('drop_interval[1]', value)}
              />
            </div>
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
          </form>
          <JackpotCard
            data={{
              ...filter,
              translations: currentTranslation
            }}
            currentTranslation={currentTranslation}
          />
        </div>
      </Paper>
    </>
  );
};

export default Edit;
