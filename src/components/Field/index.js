import React, { useRef } from 'react'

import classNames from 'classnames'

import style from './index.module.scss'

const Field = ({
  type,
  data,
  placeholder,
  onChange,
  classes = null,
  required = false,
  min = null,
  max = null,
}) => {
  const inputRef = useRef(null)

  const onFocus = () => {
    inputRef.current.focus()
  }

  return (
    <div
      className={classNames(
        style.block,
        style[type],
        classes && classes.map(el => style[el] || el),
      )}
    >
      <input
        ref={inputRef}
        className={style.input}
        type={type}
        value={data}
        onChange={e => {
          onChange(e.currentTarget.value)
        }}
        required={required}
        min={min}
        max={max}
      />
      <label className={style.label} onClick={onFocus}>
        {placeholder}
        {required && <span>*</span>}
      </label>
    </div>
  )
}

export default Field
