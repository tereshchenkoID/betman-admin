import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import clsx from 'clsx'

import style from './index.module.scss'

const Field = ({
  type,
  data,
  placeholder,
  onChange,
  classes = [],
  isRequired = false,
  isDisabled = false,
  min = null,
  max = null,
}) => {
  const isDate = type.indexOf('date') !== -1
  const inputRef = useRef(null)

  const onFocus = () => {
    inputRef.current.focus()
  }

  return (
    <div
      className={
        clsx(
          style.block,
          isDisabled && style.disabled,
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
        required={isRequired}
        min={min}
        max={max}
      />
      {
        placeholder &&
        <label className={style.label} onClick={onFocus}>
          {placeholder}
          {isRequired && <span>*</span>}
        </label>
      }
      {
        isDate
          ?
            <span className={style.remove}>
              <FontAwesomeIcon icon="fa-regular fa-calendar-days" />
            </span>
          :
            data &&
              <button
                type="button"
                className={style.remove}
                aria-label={'Remove'}
                onClick={() => {
                  onChange('')
                }}
              >
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
              </button>
      }
    </div>
  )
}

export default Field
