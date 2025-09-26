import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'

import classNames from 'classnames'

import Skeleton from 'modules/Skeleton'

import style from './index.module.scss'

const CustomSelect = ({
  placeholder,
  options,
  data,
  onChange,
  classes = [],
  isRequired= false
}) => {
  const { t } = useTranslation()
  const selectRef = useRef()

  const handleSelectChange = newValue => {
    onChange(newValue.value)
  }

  const selectedOption = useMemo(() => {
    if (!options || options.length === 0) return null
    return options.find(option => option.value === data) || null
  }, [data, options])

  if (options.length === 0) return <Skeleton styles={{ height: 56 }} counts={1} />

  return (
    <div
      className={
        classNames(
          style.block,
          classes && classes.map(el => style[el] || el),
        )
      }
    >
      <Select
        ref={selectRef}
        placeholder={t('select_value')}
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        className="react-select-container"
        classNamePrefix="react-select"
        isClearable
      />
      {
        placeholder &&
        <label className={style.label}>
          {placeholder}
          {isRequired && <span>*</span>}
        </label>
      }
    </div>
  )
}

export default CustomSelect
