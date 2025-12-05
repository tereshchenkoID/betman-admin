import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { useSettingsStore } from 'stores/settingsStore'
import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { useFilterState } from 'hooks/useFilterState'
import { buildFormData } from 'helpers/buildFormData'

import Button from 'components/Button'
import Field from 'components/Field'
import Uploader from 'components/Uploader'
import Paper from 'components/Paper'
import Tab from 'components/Tab'
import Checkbox from 'components/Checkbox'
import Redactor from 'components/Redactor'
import CustomSelect from 'components/Select'
import Debug from 'modules/Debug'
import Breadcrumbs from 'modules/Breadcrumbs'
import ImagePreview from 'modules/ImagePreview'

import style from './index.module.scss'

const Edit = ({ id }) => {
  const { t } = useTranslation()
  const isAdd = id === 'add'
  const navigate = useNavigate()
  const { settings } = useSettingsStore()
  const { request } = useApi()

  const INITIAL_FILTER = {
    id: null,
    image: '',
    visibility: 0,
    agent: -1,
    translations: Object.values(settings.site_languages).reduce((acc, lang) => {
      acc[lang.code] = {
        title: '',
        teaser: '',
        description: '',
        visibility: 0,
        category: '',
        button: {
          text: '',
          newtab: false,
          link: [],
        }
      }
      return acc
    }, {}),
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const [active, setActive] = useState(Object.values(settings?.site_languages)[0]?.code)
  const currentTranslation = filter.translations?.[active]

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

    const { data, error } = await request(REQUEST_TYPE.POST, `promo/${isAdd ? 'add' : 'edit'}`, formData)

    if (!error) {
      setFilter(data)

      if (isAdd) {
        navigate(NAVIGATION.managements.promos.link)
      }
    }
  }

  const handleLoad = async () => {
    const { data } = await request(REQUEST_TYPE.GET, `promo/${id}`)
    setFilter(data)
  }

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  useEffect(() => {
    if(!isAdd) handleLoad()
  }, [])

  return (
    <>
      <Breadcrumbs
        data={[
          NAVIGATION.home,
          NAVIGATION.managements.promos,
        ]}
        current={{text: isAdd ? t('add') : `${t('edit')} ${id}`}}
      />
      <Paper
        classes={['sm']}
        headline={isAdd ? t('add') : `${t('edit')}: ${id}`}
      >
        <Debug data={filter}/>
        <div className={style.block}>
          <form className={style.form} onSubmit={handleSubmit}>
            <CustomSelect
              placeholder={t('agent')}
              options={agentsOptions}
              data={filter.agent}
              onChange={value => handlePropsChange('agent', value)}
            />
            <Uploader
              data={filter.image}
              onChange={(blob) => handlePropsChange('image', blob)}
              maxHeight={'auto'}
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
            <Field
              type={'text'}
              placeholder={t('teaser')}
              data={currentTranslation?.teaser}
              onChange={value => handlePropsChange(`translations.${active}.teaser`, value)}
              isRequired={true}
            />
            <div>
              <Field
                type={'text'}
                placeholder={t('category')}
                data={currentTranslation?.category}
                onChange={value => handlePropsChange(`translations.${active}.category`, value)}
                isRequired={true}
              />
              <p className={style.label}>Example: <strong>New, Top</strong></p>
            </div>
            <Redactor
              key={active}
              data={currentTranslation?.description}
              action={(value) => handlePropsChange(`translations.${active}.description`, value)}
            />
            <div className={style.grid}>
              <Field
                type={'text'}
                placeholder={t('button_label')}
                data={currentTranslation?.button.text}
                onChange={value => handlePropsChange(`translations.${active}.button.text`, value)}
              />
              <div>
                <Field
                  type={'text'}
                  placeholder={t('button_link')}
                  data={currentTranslation?.button.link}
                  onChange={value => handlePropsChange(`translations.${active}.button.link`, value)}
                />
                <p className={style.label}>Example: <strong>/promo/first-deposit</strong></p>
              </div>
            </div>
            <Checkbox
              placeholder={t('new_tab')}
              data={currentTranslation?.button.newtab}
              onChange={value => handlePropsChange(`translations.${active}.button.newtab`, value)}
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
            <div className={style.promo}>
              <div className={style.picture}>
                {
                  filter?.image &&
                  <ImagePreview
                    image={filter.image}
                    width={320}
                    height={128}
                    alt={t('preview')}
                  />
                }
                {
                  currentTranslation?.category !== '' &&
                  <div className={style.categories}>
                    {
                      currentTranslation?.category.split(',').map((el, idx) =>
                        <div
                          key={idx}
                          className={style.badge}
                        >
                          {el}
                        </div>
                      )
                    }
                  </div>
                }
              </div>
              <h1>{currentTranslation?.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: currentTranslation?.description }} />
              {
                currentTranslation?.button.text !== '' &&
                <Button
                  classes={['primary', 'sm', style.button]}
                  placeholder={currentTranslation?.button.text}
                />
              }
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default Edit;
