import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import classNames from 'classnames'

import style from './index.module.scss'

const Field = ({
  type,
  data,
  placeholder,
  onChange,
  classes = null,
  required = false,
  disabled = false,
  min = null,
  max = null,
}) => {
  const inputRef = useRef(null)

  const onFocus = () => {
    inputRef.current.focus()
  }

  return (
    <div
      className={
        classNames(
          style.block,
          disabled && style.disabled,
          classes && classes.map(el => style[el] || el),
        )
      }
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
      {
        placeholder &&
        <label className={style.label} onClick={onFocus}>
          {placeholder}
          {required && <span>*</span>}
        </label>
      }

      {
        data &&
        <button
          type="button"
          className={style.remove}
          aria-label={'remove'}
          onClick={() => {
            onChange('')
          }}
        >
          <FontAwesomeIcon
            className={style.icon}
            icon={'fa-solid fa-xmark'}
          />
        </button>
      }
    </div>
  )
}

export default Field
