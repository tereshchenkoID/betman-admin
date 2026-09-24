import { useRef } from 'react'
import clsx from 'clsx'
import { CalendarDays, X } from 'lucide-react'

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
              <CalendarDays size="20" />
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
                <X size="20" />
              </button>
      }
    </div>
  )
}

export default Field
