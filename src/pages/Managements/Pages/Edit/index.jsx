import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { NAVIGATION, REQUEST_TYPE } from 'src/constant/config'

import { useSettingsStore } from 'src/stores/settingsStore'
import { useApi } from 'src/hooks/useApi'
import { useOptions } from 'src/hooks/useOptions'
import { useFilterState } from 'src/hooks/useFilterState'
import { buildFormData } from 'src/helpers/buildFormData'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Checkbox from 'components/Checkbox'
import CustomSelect from 'components/Select'
import Tab from 'components/Tab'
import Redactor from 'components/Redactor'
import Debug from 'modules/Debug'
import Breadcrumbs from 'modules/Breadcrumbs'
import Inner from 'modules/Inner'
import Back from 'modules/Back/index.jsx'

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
    alias: '',
    link: '',
    newtab: '0',
    translations: Object.values(settings.site_languages).reduce((acc, lang) => {
      acc[lang.code] = {
        title: '',
        description: '',
        visibility: "0",
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

    const { data, error } = await request(REQUEST_TYPE.POST, `page/${isAdd ? 'add' : 'edit'}`, formData)

    if (!error) {
      setFilter(data)

      if (isAdd) {
        navigate(NAVIGATION.managements.pages.link)
      }
    }
  }

  const handleLoad = async () => {
    const { data } = await request(REQUEST_TYPE.GET, `page/${id}`)
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

  const startsWithH1 = (htmlContent) => {
    if (!htmlContent) return false
    return /^\s*<h1[\s>]/i.test(htmlContent)
  }

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
          NAVIGATION.managements.pages,
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
              <Field
                type={'text'}
                placeholder={t('alias')}
                data={filter.alias}
                onChange={value => handlePropsChange('alias', value)}
                isRequired={true}
              />
              <div>
                <Field
                  type={'text'}
                  placeholder={t('link')}
                  data={filter.link}
                  onChange={value => handlePropsChange('link', value)}
                  isRequired={true}
                />
                <p className={style.label}>Example: <strong>/info/privacy-policy</strong></p>
                <Checkbox
                  placeholder={t('new_tab')}
                  data={filter.newtab}
                  onChange={value => handlePropsChange('newtab', value)}
                />
              </div>
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
            <Field
              type={'text'}
              placeholder={t('title')}
              data={currentTranslation?.title}
              onChange={value => handlePropsChange(`translations.${active}.title`, value)}
              isRequired={true}
            />
            <p className={style.notification}>{t('notification.redactor_h1')}</p>
            <Redactor
              key={active}
              data={currentTranslation?.description}
              action={(value) => handlePropsChange(`translations.${active}.description`, value)}
              height={600}
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
            <p className={style.label}>{t('preview')}:</p>
            <div className={style.preview}>
              {
                startsWithH1(currentTranslation?.description) &&
                <Back classes={style.back} />
              }
              <Inner data={currentTranslation?.description } />
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default Edit;
