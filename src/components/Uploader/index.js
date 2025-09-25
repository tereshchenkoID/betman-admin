import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from 'components/Button'

import style from './index.module.scss'

const Uploader = ({
  id = 'upload',
  data,
  onChange = () => {},
  maxHeight = 128,
}) => {
  const { t } = useTranslation()
  const [previewUrl, setPreviewUrl] = useState(null)
  const createdUrlRef = useRef(null)
  const inputRef = useRef(null)

  const revokeUrl = () => {
    if (createdUrlRef.current) {
      URL.revokeObjectURL(createdUrlRef.current)
      createdUrlRef.current = null
    }
  }

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  useEffect(() => {
    revokeUrl()

    if (!data) {
      setPreviewUrl(null)
    } else if (data instanceof Blob || data instanceof File) {
      const url = URL.createObjectURL(data)
      createdUrlRef.current = url
      setPreviewUrl(url)
    } else if (typeof data === 'string') {
      if (data.startsWith('blob:') || data.startsWith('http')) {
        setPreviewUrl(data)
      } else {
        setPreviewUrl(null)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [data])

  useEffect(() => () => revokeUrl(), [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    revokeUrl()

    const url = URL.createObjectURL(file)
    createdUrlRef.current = url
    setPreviewUrl(url)

    onChange(file)
    resetInput()
  }

  const handleRemove = () => {
    revokeUrl()
    setPreviewUrl(null)
    onChange(null)
    resetInput()
  }

  return (
    <div className={style.block}>
      <div className={style.upload}>
        <label htmlFor={id} className={style.label}>
          <FontAwesomeIcon icon="fa-solid fa-plus" />
          <span>{t('upload_file')}</span>
        </label>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={style.input}
        />
      </div>

      {previewUrl && (
        <div className={style.preview} style={{ maxHeight }}>
          <img src={previewUrl} alt="Preview" />
          <Button
            classes={['primary', style.close]}
            onChange={handleRemove}
          >
            <FontAwesomeIcon icon="fa-solid fa-times" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Uploader
