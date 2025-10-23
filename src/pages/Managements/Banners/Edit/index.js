import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useOptions } from 'hooks/useOptions'
import { useFilterState } from 'hooks/useFilterState'
import { buildFormData } from 'helpers/buildFormData'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Uploader from 'components/Uploader'
import Checkbox from 'components/Checkbox'
import CustomSelect from 'components/Select'
import Tab from 'components/Tab'
import Debug from 'modules/Debug'
import Breadcrumbs from 'modules/Breadcrumbs'
import ImagePreview from 'modules/ImagePreview'

import style from './index.module.scss'

const Edit = ({ id }) => {
  const { t } = useTranslation()
  const isAdd = id === 'add'
  const navigate = useNavigate()
  const { request } = useApi()
  const { settings } = useSelector(state => state.settings)

  const INITIAL_FILTER = {
    id: null,
    image: '',
    visibility: '0',
    agent: -1,
    translations: Object.values(settings.site_languages).reduce((acc, lang) => {
      acc[lang.code] = {
        title: '',
        subtitle: '',
        alt: '',
        description: '',
        visibility: "0",
        button: {
          text: '',
          newtab: "0",
          link: [],
        }
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

    const { data, error } = await request(REQUEST_TYPE.POST, `banner/${isAdd ? 'add' : 'edit'}`, formData)

    if (!error) {
      setFilter(data)

      if (isAdd) {
        navigate(NAVIGATION.managements.banners.link)
      }
    }
  }

  const handleLoad = async () => {
    const { data } = await request(REQUEST_TYPE.GET, `banner/${id}`)
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
          NAVIGATION.managements.banners,
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
            <div className={style.grid}>
              <Field
                type={'text'}
                placeholder={t('title')}
                data={currentTranslation?.title}
                onChange={value => handlePropsChange(`translations.${active}.title`, value)}
                isRequired={true}
              />
              <Field
                type={'text'}
                placeholder={t('subtitle')}
                data={currentTranslation?.subtitle}
                onChange={value => handlePropsChange(`translations.${active}.subtitle`, value)}
                isRequired={true}
              />
            </div>
            <Field
              type={'text'}
              placeholder={t('text')}
              data={currentTranslation?.alt}
              onChange={value => handlePropsChange(`translations.${active}.alt`, value)}
            />
            <Field
              type={'text'}
              placeholder={t('description')}
              data={currentTranslation?.description}
              onChange={value => handlePropsChange(`translations.${active}.description`, value)}
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
                <p className={style.label}>Example: <strong>promotions/first-deposit</strong></p>
              </div>
            </div>
            <Checkbox
              placeholder={t('new_tab')}
              data={currentTranslation?.button.newtab}
              onChange={value => handlePropsChange(`translations.${active}.button.newtab`, value)}
            />
            <Checkbox
              placeholder={t('visibility')}
              data={currentTranslation?.visibility}
              onChange={value => handlePropsChange(`translations.${active}.visibility`, value)}
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
            <div className={style.banner}>
              {
                filter?.image &&
                <ImagePreview
                  image={filter.image}
                  className={style.picture}
                  width={320}
                  height={128}
                  alt={t('preview')}
                />
              }
              <div className={style.content}>
                <p className={style.title}>{currentTranslation?.title}</p>
                <p className={style.subtitle}>{currentTranslation?.subtitle}</p>
                <p className={style.description}>{currentTranslation?.alt}</p>
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
        </div>
      </Paper>
    </>
  );
};

export default Edit;
