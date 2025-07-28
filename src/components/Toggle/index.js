import React from 'react'

import classNames from 'classnames'

import style from './index.module.scss'

const Toggle = ({
  data,
  placeholder,
  onChange,
  classes = null,
  required = false,
}) => {
  return (
    <label
      className={
        classNames(
          style.block,
          classes && classes.map(el => style[el]),
        )
      }
    >
      <input
        type={'checkbox'}
        className={style.input}
        checked={data === '1'}
        onChange={() => onChange(data === '1' ? '0' : '1')}
      />
      <span className={style.item} />
      {
        placeholder &&
        <span>
          {placeholder}
          {required && <span className={style.label}>*</span>}
        </span>
      }
    </label>
  )
}

export default Toggle
