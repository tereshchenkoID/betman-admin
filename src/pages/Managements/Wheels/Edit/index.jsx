import { useEffect, useState, useMemo } from 'react'
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
import CustomSelect from 'components/Select'
import Checkbox from 'components/Checkbox'
import Icon from 'components/Icon'
import Tab from 'components/Tab'
import Redactor from 'components/Redactor'
import Debug from 'modules/Debug'
import Breadcrumbs from 'modules/Breadcrumbs'
import Wheel from './Wheel'

import style from './index.module.scss'

const MAX_SECTORS = 12
const MIN_SECTORS = 2

const Edit = ({ id }) => {
  const { t } = useTranslation()
  const isAdd = id === 'add'
  const navigate = useNavigate()
  const { request } = useApi()
  const { settings } = useSettingsStore()

  const INITIAL_FILTER = {
    id: null,
    agent: -1,
    visibility: '0',
    data: [],
    translations: Object.values(settings.site_languages).reduce((acc, lang) => {
      acc[lang.code] = {
        title: '',
        description: '',
      }
      return acc
    }, {}),
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)
  const [active, setActive] = useState(Object.values(settings?.site_languages)[0]?.code)
  const currentTranslation = filter?.translations?.[active]

  const totalPercentSum = useMemo(() => {
    return (filter.data || []).reduce((acc, item) => acc + (Number(item?.percent) || 0), 0)
  }, [filter.data])

  const isSumValid = totalPercentSum <= 100

  const wheelMock = useMemo(() => {
    return {
      ...filter,
      data: (filter.data || []).map((item) => item?.bonus ?? item),
    }
  }, [filter])

  const handleResetForm = () => {
    if (isAdd) {
      setFilter(INITIAL_FILTER)
    } else {
      handleLoad()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isSumValid || (filter.data?.length || 0) < MIN_SECTORS) return

    const formData = buildFormData(filter)

    const { data, error } = await request(
      REQUEST_TYPE.POST,
      `wheel/data/${isAdd ? 'add' : 'edit'}`,
      formData
    )

    if (!error) {
      setFilter(data)

      if (isAdd) {
        navigate(NAVIGATION.managements.wheels.link)
      }
    }
  }

  const handleLoad = async () => {
    const { data } = await request(REQUEST_TYPE.GET, `wheel/data/${id}`)
    setFilter(data)
  }

  const handleSectorChange = (index, field, value) => {
    const updated = [...(filter.data || [])]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }

    setFilter({
      ...filter,
      data: updated,
    })
  }

  const handleAdd = () => {
    if ((filter.data?.length || 0) >= MAX_SECTORS) return

    setFilter({
      ...filter,
      data: [...(filter.data || []), { bonus: -1, percent: null }],
    })
  }

  const handleRemove = (index) => {
    setFilter({
      ...filter,
      data: filter.data.filter((_, i) => i !== index),
    })
  }

  const { options: agentsOptions } = useOptions(
    'agents_tree/',
    (el) => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  const { options: bonusesOptions } = useOptions(
    'bonuses_list/',
    (el) => ({ value: el.id, label: el.username }),
    [{ value: -1, label: t('select_from_list') }]
  )

  useEffect(() => {
    if (!isAdd) {
      handleLoad()
    }
  }, [])

  return (
    <>
      <Breadcrumbs
        data={[NAVIGATION.home, NAVIGATION.managements.wheels]}
        current={{ text: isAdd ? 'add' : `${t('edit')} ${id}` }}
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
              onChange={(value) => handlePropsChange('agent', value)}
            />
            <Tab
              data={active}
              action={setActive}
              options={Object.entries(
                Object.fromEntries(
                  Object.values(settings.site_languages).map((item) => [
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
              onChange={(value) => handlePropsChange(`translations.${active}.title`, value)}
              isRequired={true}
            />
            <Redactor
              key={active}
              data={currentTranslation?.description}
              action={(value) => handlePropsChange(`translations.${active}.description`, value)}
            />
            <Checkbox
              placeholder={t('visibility')}
              data={filter?.visibility}
              onChange={(value) => handlePropsChange('visibility', value)}
            />
            <hr />

            <div className={style.grid}>
              {
                filter.data?.map((el, idx) =>
                <div key={idx} className={style.row}>
                  <CustomSelect
                    placeholder={`${t('sector')} ${idx + 1}`}
                    options={bonusesOptions}
                    data={el?.bonus}
                    onChange={(value) => handleSectorChange(idx, 'bonus', value)}
                    isRequired={true}
                  />
                  <Field
                    type={'number'}
                    placeholder={`${t('win')}, %`}
                    data={el?.percent}
                    onChange={(value) => handleSectorChange(idx, 'percent', value)}
                    isRequired={true}
                    min={0}
                    max={100}
                  />
                  <Icon
                    classes={['error']}
                    icon="fa-trash"
                    alt="delete"
                    action={() => handleRemove(idx)}
                  />
                </div>
              )}
            </div>

            <div className={style.row}>
              <div style={{ gridArea: '1 / 3' }}>
                <Icon
                  classes={['success']}
                  icon="fa-add"
                  alt="add"
                  action={handleAdd}
                  disabled={filter.data?.length >= MAX_SECTORS}
                />
              </div>
            </div>
            <div
              className={
                clsx(
                  style.notification,
                  !isSumValid && style.error
                )
              }
            >
              {t('total_win')}: <strong>{totalPercentSum}%</strong> - {t('max')}: <strong>100%</strong>
            </div>

            <div className={style.actions}>
              <Button
                type={'submit'}
                classes={['primary']}
                placeholder={t('save')}
                isDisabled={filter.data?.length < MIN_SECTORS || !isSumValid}
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
            {
              filter?.data?.length > 0 &&
              <Wheel mock={wheelMock} />
            }
          </div>
        </div>
      </Paper>
    </>
  )
}

export default Edit
