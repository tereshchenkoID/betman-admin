import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'

import Button from 'components/Button'

import style from './index.module.scss'

const MultiImageUploader = ({
  id = 'multi-image-uploader',
  data = [],
  onChange = () => {},
}) => {
  const { t } = useTranslation()
  const [previews, setPreviews] = useState([])
  const createdUrlsRef = useRef([])
  const inputRef = useRef(null)

  const revokeUrls = () => {
    createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    createdUrlsRef.current = []
  }

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  useEffect(() => {
    revokeUrls()

    const dataArray = Array.isArray(data) ? data : data ? [data] : []
    const newCreatedUrls = []

    const items = dataArray
      .map((item) => {
        if (!item) return null

        if (item instanceof Blob || item instanceof File) {
          const url = URL.createObjectURL(item)
          newCreatedUrls.push(url)
          return { url, original: item }
        }

        if (typeof item === 'string' && (item.startsWith('blob:') || item.startsWith('http') || item.startsWith('data:'))) {
          return { url: item, original: item }
        }

        return null
      })
      .filter(Boolean)

    createdUrlsRef.current = newCreatedUrls
    setPreviews(items)
  }, [data])

  useEffect(() => () => revokeUrls(), [])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const currentData = Array.isArray(data) ? data : data ? [data] : []
    onChange([...currentData, ...files])
    resetInput()
  }

  const handleRemove = (indexToRemove) => {
    const currentData = Array.isArray(data) ? data : data ? [data] : []
    const updatedData = currentData.filter((_, index) => index !== indexToRemove)

    onChange(updatedData)
    resetInput()
  }

  return (
    <div className={style.block}>
      <div className={style.upload}>
        <label htmlFor={id} className={style.label}>
          <Plus size="20"/>
          <span>{t('upload_file')}</span>
        </label>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className={style.input}
        />
      </div>

      {
        previews.length > 0 &&
        <div className={style.list}>
          {
            previews.map((preview, index) =>
              <div
                key={preview.url + index}
                className={style.preview}
              >
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                />
                <Button
                  classes={['primary', style.close]}
                  onChange={() => handleRemove(index)}
                >
                  <X size="20"/>
                </Button>
              </div>
            )
          }
        </div>
      }
    </div>
  )
}

export default MultiImageUploader
