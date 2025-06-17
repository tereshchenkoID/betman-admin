import React, { useRef } from 'react'

import classNames from 'classnames'

import style from './index.module.scss'

const Textarea = ({ placeholder, data, onChange, classes }) => {
  const inputRef = useRef(null)

  const onFocus = () => {
    inputRef.current.focus()
  }

  return (
    <div
      className={classNames(
        style.block,
        classes && classes.map(el => style[el]),
      )}
    >
      <textarea
        ref={inputRef}
        className={style.input}
        value={data}
        onChange={e => {
          onChange(e.currentTarget.value)
        }}
      />
      {placeholder && (
        <label className={style.label} onClick={onFocus}>
          {placeholder}
        </label>
      )}
    </div>
  )
}

export default Textarea
