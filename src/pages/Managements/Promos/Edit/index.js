import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Editor } from '@tinymce/tinymce-react'

import Button from 'components/Button'
import Field from 'components/Field'
import Uploader from 'components/Uploader'
import Paper from 'components/Paper'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const INITIAL_FILTER = {
  title: '',
  subtitle: '',
  description: '',
  category: '',
  image: '',
}

const Edit = ({ id }) => {
  const { t } = useTranslation()

  const [filter, setFilter] = useState(INITIAL_FILTER)
  const editorRef = useRef(null)

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

    if (editorRef.current) {
      const html = editorRef.current.getContent();
      setFilter(prev => ({ ...prev, description: html }));
    }
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
              isRequired={true}
            />
            <Field
              type={'text'}
              placeholder={t('subtitle')}
              data={filter.subtitle}
              onChange={value => handlePropsChange('subtitle', value)}
              isRequired={true}
            />
          </div>
          <Field
            type={'text'}
            placeholder={t('category')}
            data={filter.category}
            onChange={value => handlePropsChange('category', value)}
            isRequired={true}
          />
          <Editor
            apiKey='gqm3ektdsagwkj4vf9fkzs703utk9izk8j89podwhtfm66q0'
            onInit={(_evt, editor) => (editorRef.current = editor)}
            value={filter.description}
            onEditorChange={(content) =>
              handlePropsChange('description', content)
            }
            init={{
              height: 300,
              menubar: false,
              skin: 'tinymce-5',
              content_css: 'tinymce-5',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar:
                'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            }}
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
        </div>
      </div>
    </Paper>
  );
};

export default Edit;
