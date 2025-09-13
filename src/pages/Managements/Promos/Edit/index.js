import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'
import { Editor } from '@tinymce/tinymce-react';

import Button from 'components/Button'
import Field from "components/Field";
import Uploader from 'components/Uploader'

import Debug from "modules/Debug";

import style from './index.module.scss'

const Edit = ({ bannerId, onSubmit }) => {
  const { t } = useTranslation()

  const initialValue = {
    title: '',
    subtitle: '',
    category: '',
    description: '',
    image: null,
  }

  const [filter, setFilter] = useState(initialValue)
  const [image, setImage] = useState(filter.image)
  const editorRef = useRef(null)

  useEffect(() => {
    if (bannerId) {
      // fetch(`/api/banners/${bannerId}`)
      //   .then(res => res.json())
      //   .then(data => setFilter({ ...form, ...data }));
    }
  }, [bannerId]);

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  // const handleImageChange = e => {
  //   setFilter(prev => ({ ...prev, image: e.target.files[0] }));
  // };

  const handleSubmit = e => {
    e.preventDefault();
    // onSubmit(filter)
    console.log(filter);

    if (editorRef.current) {
      const html = editorRef.current.getContent();
      setFilter(prev => ({ ...prev, description: html }));
    }
    onSubmit?.({ ...filter, description: editorRef.current?.getContent() });
  };

  return (
    <div className={style.block}>
      <form className={style.form} onSubmit={handleSubmit}>
        <Debug data={filter}/>
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
        <Uploader
          data={image}
          onChange={setImage}
        />
        <div className={style.actions}>
          <Button
            classes={['primary']}
            placeholder={bannerId ? t('save') : t('create')}
            onClick={() => alert('FORM ACTION!')}
          />
        </div>
      </form>
      <div className="preview">
        PREVIEW IMAGE
      </div>
    </div>
  );
};

export default Edit;
