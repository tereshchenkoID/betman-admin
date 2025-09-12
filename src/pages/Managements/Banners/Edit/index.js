import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'

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
    image: null,
  }

  const [filter, setFilter] = useState(initialValue)
  const [image, setImage] = useState(filter.image)

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
    onSubmit?.(filter);
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
