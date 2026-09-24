import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { NAVIGATION, REQUEST_TYPE } from 'src/constant/config'

import { buildFormData } from 'src/helpers/buildFormData'
import { useApi } from 'src/hooks/useApi'
import { useFilterState } from 'src/hooks/useFilterState'
import { useOptions } from 'src/hooks/useOptions'
import { useSettingsStore } from 'src/stores/settingsStore'

import Button from 'components/Button'
import Checkbox from 'components/Checkbox'
import Field from 'components/Field'
import MultiUploader from 'components/MultiUploader'
import Paper from 'components/Paper'
import CustomSelect from 'components/Select'
import Tab from 'components/Tab'
import Breadcrumbs from 'modules/Breadcrumbs'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Edit = ({ id }) => {
  const { t } = useTranslation()
  const isAdd = id === 'add'
  const navigate = useNavigate()
  const { request } = useApi()
  const { settings } = useSettingsStore()

  const INITIAL_FILTER = {
    id: null,
    visibility: '0',
    agent: -1,
    translations: Object.values(settings.site_languages).reduce((acc, lang) => {
      acc[lang.code] = {
        title: '',
        subtitle: '',
        alt: '',
        description: '',
        image: [],
        visibility: '0',
        button: {
          text: '',
          newtab: '0',
          link: [],
          auth_link: []
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
    Object.entries(filter.translations).forEach(([lang, langData]) => {
      const images = langData?.image || []

      images.forEach((img, index) => {
        if (img instanceof File || img instanceof Blob) {
          formData.append(`image_${lang}_${index}`, img)
        }
      })
    })

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
        current={{ text: isAdd ? 'add' : `${t('edit')} ${id}` }}
      />
      <Paper
        classes={['sm']}
        headline={isAdd ? t('add') : `${t('edit')}: ${id}`}
      >
        <Debug data={filter} />
        <form className={style.block} onSubmit={handleSubmit}>
          <div className={style.wrapper}>
            <CustomSelect
              placeholder={t('agent')}
              options={agentsOptions}
              data={filter.agent}
              onChange={value => handlePropsChange('agent', value)}
            />
          </div>
          <div className={style.wrapper}>
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
          </div>
          <div className={style.wrapper}>
            <div className={style.form}>
              <MultiUploader
                data={currentTranslation?.image}
                onChange={(blob) => handlePropsChange(`translations.${active}.image`, blob)}
              />
            </div>
            <div className={style.form}>
              <div className={style.grid}>
                <Field
                  type={'text'}
                  placeholder={t('title')}
                  data={currentTranslation?.title}
                  onChange={value => handlePropsChange(`translations.${active}.title`, value)}
                />
                <Field
                  type={'text'}
                  placeholder={t('subtitle')}
                  data={currentTranslation?.subtitle}
                  onChange={value => handlePropsChange(`translations.${active}.subtitle`, value)}
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
              <Field
                type={'text'}
                placeholder={t('button_label')}
                data={currentTranslation?.button?.text}
                onChange={value => handlePropsChange(`translations.${active}.button.text`, value)}
              />
              <div className={style.grid}>
                <div>
                  <Field
                    type={'text'}
                    placeholder={t('link')}
                    data={currentTranslation?.button?.link}
                    onChange={value => handlePropsChange(`translations.${active}.button.link`, value)}
                  />
                  <p className={style.label}>Example: <strong>/promotions/first-deposit</strong></p>
                </div>
                <div>
                  <Field
                    type={'text'}
                    placeholder={t('link_auth')}
                    data={currentTranslation?.button?.auth_link}
                    onChange={value => handlePropsChange(`translations.${active}.button.auth_link`, value)}
                  />
                </div>
              </div>
              <Checkbox
                placeholder={t('new_tab')}
                data={currentTranslation?.button?.newtab}
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
            </div>
          </div>
        </form>
      </Paper>
    </>
  )
}

export default Edit
