import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Field from 'components/Field'
import Uploader from 'components/Uploader'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const INITIAL_FILTER = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  button: {
    text: '',
    link: [],
  }
}

const Edit = ({ id }) => {
  const { t } = useTranslation()
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
    setFilter(INITIAL_FILTER)
  }

  const handleSubmit = e => {
    e.preventDefault();

    alert('Send')
  };

  return (
    <Paper
      classes={['sm']}
      headline={id === '-1' ? t('add') : `${t('edit')}: ${id}`}
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
              <img
                src={URL.createObjectURL(filter.image)}
                className={style.picture}
                width={320}
                height={128}
                loading='eager'
                fetchPriority='high'
                decoding='auto'
                alt={t('preview')}
              />
            }
            <div className={style.content}>
              <p className={style.title}>{filter.title}</p>
              <p className={style.subtitle}>{filter.subtitle}</p>
              <p className={style.description}>{filter.description}</p>
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
  );
};

export default Edit;
