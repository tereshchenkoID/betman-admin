import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from 'components/Button'

import style from './index.module.scss'

const Uploader = ({
  id = 'upload',
  data,
  onChange,
  maxHeight = 128,
}) => {
  const { t } = useTranslation()
  const [blob, setBlob] = useState(null)

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newBlob = new Blob([reader.result], { type: file.type })
        setBlob(URL.createObjectURL(newBlob))
        onChange(newBlob)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleRemove = () => {
    setBlob(null)
    onChange(null)
  }

  useEffect(() => {
    if (data instanceof Blob) {
      const url = URL.createObjectURL(data)
      setBlob(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setBlob(null)
    }
    }, [data])

  return (
    <div className={style.block}>
      <div className={style.upload}>
        <label htmlFor={id} className={style.label}>
          <FontAwesomeIcon icon="fa-solid fa-plus" />
          <span>{t('upload_file')}</span>
        </label>
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className={style.input}
        />
      </div>
      {
        blob &&
        <div
          className={style.preview}
          style={{
            maxHeight: maxHeight,
          }}
        >
          <img
            src={blob}
            alt="Preview"
          />
          <Button
            classes={['primary', style.close]}
            onChange={handleRemove}
          >
            <FontAwesomeIcon icon="fa-solid fa-times" />
          </Button>
        </div>
      }
    </div>
  )
}

export default Uploader
