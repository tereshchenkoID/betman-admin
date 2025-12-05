import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { useSettingsStore } from 'stores/settingsStore'
import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { useFilterState } from 'hooks/useFilterState'
import { buildFormData } from 'helpers/buildFormData'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Uploader from 'components/Uploader'
import Tab from 'components/Tab'
import CustomSelect from 'components/Select'
import Redactor from 'components/Redactor'
import Debug from 'modules/Debug'
import Breadcrumbs from 'modules/Breadcrumbs'
import ImagePreview from 'modules/ImagePreview'

import style from './index.module.scss'

const Edit = ({ id }) => {
  const { t } = useTranslation()
  const isAdd = id === 'add'
  const navigate = useNavigate()
  const { request } = useApi()
  const { settings } = useSettingsStore()

  const INITIAL_FILTER = {
    id: null,
    image: '',
    agent: -1,
    translations: Object.values(settings.site_languages).reduce((acc, lang) => {
      acc[lang.code] = {
        title: '',
        text: '',
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

    const { data, error } = await request(REQUEST_TYPE.POST, `message/${isAdd ? 'add' : 'edit'}`, formData)

    if (!error) {
      setFilter(data)

      if (isAdd) {
        navigate(NAVIGATION.managements.notifications.link)
      }
    }
  }

  const handleLoad = async () => {
    const { data } = await request(REQUEST_TYPE.GET, `message/${id}`)
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
          NAVIGATION.managements.notifications,
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
            <CustomSelect
              placeholder={t('agent')}
              options={agentsOptions}
              data={filter.agent}
              onChange={value => handlePropsChange('agent', value)}
            />
            <Uploader
              data={filter?.image}
              onChange={(blob) => handlePropsChange('image', blob)}
            />
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
            <Field
              type={'text'}
              placeholder={t('title')}
              data={currentTranslation?.title}
              onChange={value => handlePropsChange(`translations.${active}.title`, value)}
              isRequired={true}
            />
            <Redactor
              key={active}
              data={currentTranslation?.text}
              action={(value) => handlePropsChange(`translations.${active}.text`, value)}
            />
            <Field
              type={'text'}
              placeholder={t('description')}
              data={currentTranslation?.description}
              onChange={value => handlePropsChange(`translations.${active}.description`, value)}
              isRequired={true}
            />
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
          <div>
            <p className={style.text}>{t('preview')}:</p>

            <div className={style.notification}>
              <div className={style.header}>
                <h3 className={style.title}>{currentTranslation?.title}</h3>
                <Button classes={['secondary', 'sm', 'square', style.close]}>
                  <FontAwesomeIcon icon="fa-solid fa-times" />
                </Button>
              </div>
              <div className={style.content}>
                {
                  filter?.image &&
                  <ImagePreview
                    image={filter.image}
                    className={style.picture}
                    alt={t('preview')}
                  />
                }
                <div className={style.description} dangerouslySetInnerHTML={{ __html: currentTranslation?.text }} />
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default Edit;
