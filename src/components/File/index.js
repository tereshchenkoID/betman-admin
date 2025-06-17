import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import classNames from 'classnames'

import style from './index.module.scss'

const File = ({ data, onChange, classes }) => {
  const { t } = useTranslation()
  const [image, setImage] = useState(data)
  const fileInputRef = useRef(null)

  const handleFileChange = event => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setImage(reader.result)
      }

      reader.readAsDataURL(file)
      onChange(file)
    }
  }

  const handleRemoveFile = () => {
    setImage(null)
    onChange(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      className={classNames(
        style.block,
        classes && classes.map(el => style[el]),
      )}
    >
      <label className={style.label}>
        <input
        ref={fileInputRef}
          type={'file'}
          accept={'image/*'}
          className={style.input}
          onChange={handleFileChange}
        />
        {image ? (
          <div className={style.preview}>
            <img src={image} className={style.img} alt={'Preview'} />
          </div>
        ) : (
          <FontAwesomeIcon icon="fa-solid fa-user" className={style.icon} />
        )}
      </label>
      <button
        className={classNames(style.action, !image && style.disabled)}
        type={'button'}
        title={t('remove')}
        onClick={handleRemoveFile}
      >
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>
    </div>
  )
}

export default File
