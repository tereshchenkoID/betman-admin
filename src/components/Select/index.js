import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'

import classNames from 'classnames'

import style from './index.module.scss'

const CustomSelect = ({ placeholder, options, data, onChange, classes }) => {
  const { t } = useTranslation()
  const selectRef = useRef()

  const handleSelectChange = newValue => {
    onChange(newValue.value)
  }
  useEffect(() => {
    if (data === '') {
      selectRef.current.option = null
    }
  }, [data])

  return (
    <div
      className={classNames(
        style.block,
        classes && classes.map(el => style[el]),
      )}
    >
      <Select
        ref={selectRef}
        placeholder={t('select_values')}
        value={options.find(option => option.value === data) || null}
        options={options}
        onChange={handleSelectChange}
        className="react-select-container"
        classNamePrefix="react-select"
        isClearable
      />
      {placeholder && <label className={style.label}>{placeholder}</label>}
    </div>
  )
}

export default CustomSelect
