import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Field from 'components/Field'
import ColorPicker from '../ColorPicker'

const Create = ({ 
  isDisabled,
  handlePropsChange,
  handleLoadSkin,
  skin,
  filter,
  setFilter
}) => {
  const { t } = useTranslation()

  useEffect(() => {
    handleLoadSkin(-1)
  }, [])
  
  if(!skin) return

  return (
    <>
      <Field
        placeholder={t('name')}
        data={filter.name}
        onChange={value =>
          setFilter((prev) => ({
            ...prev,
            name: value,
          }))
        }
        classes={[isDisabled && 'disabled']}
      />
      {
        skin?.map((el, idx) =>
          <ColorPicker
            key={idx}
            data={el}
            isDisabled={isDisabled || el.visible === '0'}
            onChange={(value) => handlePropsChange(idx, value)}
          />
        )
      }
    </>
  )
}

export default Create
