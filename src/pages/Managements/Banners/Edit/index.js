import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { buildFormData } from 'helpers/buildFormData'
import { useApi } from 'hooks/useApi'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Uploader from 'components/Uploader'
import Checkbox from 'components/Checkbox'
import Debug from 'modules/Debug'
import Breadcrumbs from 'modules/Breadcrumbs'
import ImagePreview from 'modules/ImagePreview'

import style from './index.module.scss'

const INITIAL_FILTER = {
  image: '',
  title: '',
  subtitle: '',
  alt: '',
  description: '',
  visibility: 0,
  button: {
    text: '',
    newtab: false,
    link: [],
  }
}

const Edit = ({ id }) => {
  const { t } = useTranslation()
  const isAdd = id === 'add'
  const navigate = useNavigate()
  const { request } = useApi()
  const [filter, setFilter] = useState(INITIAL_FILTER)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => {
      const keys = fieldName.split('.')
      let updated = { ...prevData }
      let obj = updated

      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] }
        obj = obj[keys[i]]
      }

      obj[keys[keys.length - 1]] = fieldValue
      return updated
    })
  }

  const handleResetForm = () => {
    if(!isAdd) handleLoad()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = buildFormData(filter)

    if (!isAdd) {
      formData.append('id', filter.id)
    }

    const json = await request(REQUEST_TYPE.POST, `banner/${isAdd ? 'add' : 'edit'}`, formData)
    setFilter(json?.data)

    if (isAdd) {
      navigate(NAVIGATION.managements.banners.link)
    }
  }

  const handleLoad = async () => {
    const json = await request(REQUEST_TYPE.GET, `banner/${id}`)
    setFilter(json?.data)
  }

  useEffect(() => {
    if(!isAdd) handleLoad()
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
        <Debug data={filter}/>
        <div className={style.block}>
          <form className={style.form} onSubmit={handleSubmit}>
            <Uploader
              data={filter.image}
              onChange={(blob) => handlePropsChange('image', blob)}
            />
            <div className={style.grid}>
              <Field
                type={'text'}
                placeholder={t('title')}
                data={filter.title}
                onChange={value => handlePropsChange('title', value)}
              />
              <Field
                type={'text'}
                placeholder={t('subtitle')}
                data={filter.subtitle}
                onChange={value => handlePropsChange('subtitle', value)}
              />
            </div>
            <Field
              type={'text'}
              placeholder={t('text')}
              data={filter.alt}
              onChange={value => handlePropsChange('alt', value)}
            />
            <Field
              type={'text'}
              placeholder={t('description')}
              data={filter.description}
              onChange={value => handlePropsChange('description', value)}
            />
            <div className={style.grid}>
              <Field
                type={'text'}
                placeholder={t('button_label')}
                data={filter.button.text}
                onChange={value => handlePropsChange('button.text', value)}
              />
              <div>
                <Field
                  type={'text'}
                  placeholder={t('button_link')}
                  data={filter.button.link}
                  onChange={value => handlePropsChange('button.link', value)}
                />
                <p className={style.label}>Example: <strong>promotions/first-deposit</strong></p>
              </div>
              <Checkbox
                placeholder={t('new_tab')}
                data={filter.button.newtab}
                onChange={value => handlePropsChange('button.newtab', value)}
              />
            </div>
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
                <p className={style.title}>{filter.title}</p>
                <p className={style.subtitle}>{filter.subtitle}</p>
                <p className={style.description}>{filter.alt}</p>
                {
                  filter.button.text !== '' &&
                  <Button
                    classes={['primary', 'sm', style.button]}
                    placeholder={filter.button.text}
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
