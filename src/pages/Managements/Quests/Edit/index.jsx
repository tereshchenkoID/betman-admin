import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { NAVIGATION, REQUEST_TYPE } from 'src/constant/config'

import { useSettingsStore } from 'src/stores/settingsStore'
import { useApi } from 'src/hooks/useApi'
import { useOptions } from 'src/hooks/useOptions'
import { useFilterState } from 'src/hooks/useFilterState'
import { buildFormData } from 'src/helpers/buildFormData'

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
  const { settings } = useSettingsStore()

  const INITIAL_FILTER = {
    id: null,
    visibility: '0',
    agent: -1,
    bonuses: -1,
    date_expire: '',
    translations: Object.values(settings.site_languages).reduce((acc, lang) => {
      acc[lang.code] = {
        title: '',
        visibility: "0",
        image: '',
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
    Object.entries(filter.translations).forEach(([lang, langData]) => {
      const currentImage = langData?.image
      if (currentImage instanceof File || currentImage instanceof Blob) {
        formData.append(`image_${lang}`, currentImage)
      }
    })

    const { data, error } = await request(REQUEST_TYPE.POST, `task/${isAdd ? 'add' : 'edit'}`, formData)

    if (!error) {
      setFilter(data)

      if (isAdd) {
        navigate(NAVIGATION.managements.quests.link)
      }
    }
  }

  const handleLoad = async () => {
    const { data } = await request(REQUEST_TYPE.GET, `task/${id}`)
    setFilter(data)
  }

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    el => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  const { options: bonusesOptions } = useOptions(
    `bonuses_list/`,
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
          NAVIGATION.managements.quests,
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
            <div className={style.grid}>
              <CustomSelect
                placeholder={t('bonuses')}
                options={bonusesOptions}
                data={filter.bonuses}
                onChange={value => handlePropsChange('bonuses', value)}
                isRequired={true}
              />
              <Field
                type={'datetime-local'}
                placeholder={t('expired_date')}
                data={filter.date_expire}
                onChange={value => handlePropsChange('date_expire', value)}
              />
            </div>
            <p className={style.label}>Example size: <strong>190x240</strong></p>
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
            <Uploader
              data={currentTranslation?.image}
              onChange={(blob) => handlePropsChange(`translations.${active}.image`, blob)}
            />
            <Field
              type={'text'}
              placeholder={t('title')}
              data={currentTranslation?.title}
              onChange={value => handlePropsChange(`translations.${active}.title`, value)}
            />
            <div className={style.grid}>
              <Field
                type={'text'}
                placeholder={t('button_label')}
                data={currentTranslation?.button?.text}
                onChange={value => handlePropsChange(`translations.${active}.button.text`, value)}
              />
              <div>
                <Field
                  type={'text'}
                  placeholder={t('button_link')}
                  data={currentTranslation?.button?.link}
                  onChange={value => handlePropsChange(`translations.${active}.button.link`, value)}
                />
                <p className={style.label}>Example: <strong>/game/1146/0</strong></p>
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
          </form>
          <div>
            <p className={style.text}>{t('preview')}:</p>
            <div
              className={
                clsx(
                  style.banner,
                  currentTranslation?.visibility === '0' && style.disabled
                )
              }
            >
              {
                currentTranslation?.image &&
                <ImagePreview
                  image={currentTranslation?.image}
                  className={style.picture}
                  width={168}
                  height={240}
                  alt={t('preview')}
                />
              }
              <div className={style.header}>
                <Button
                  classes={['primary', 'square', style.info]}
                  placeholder={'i'}
                />
              </div>
              <div className={style.content}>
                <p className={style.title}>{currentTranslation?.title}</p>
                {
                  currentTranslation?.button?.text !== '' &&
                  <Button
                    classes={['primary', style.button]}
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
