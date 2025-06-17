import React, { useEffect, useRef, useState } from 'react'

import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import style from './index.module.scss'

const Password = ({
  placeholder,
  data,
  onChange,
  classes = null,
  required = false,
  password = false,
}) => {
  const [show, setShow] = useState(password)
  const inputRef = useRef(null)

  const onFocus = () => {
    inputRef.current.focus()
  }

  useEffect(() => {
    setShow(password)
  }, [password])

  return (
    <div
      className={
        classNames(
          style.block,
          classes && classes.map(el => style[el]),
        )
      }
    >
      <input
        ref={inputRef}
        className={style.input}
        type={show ? 'text' : 'password'}
        value={data}
        onChange={e => {
          onChange(e.currentTarget.value)
        }}
        required={required}
      />
      <label className={style.label} onClick={onFocus}>
        {placeholder}
        {required && <span>*</span>}
      </label>

      <button
        type={'button'}
        className={style.eye}
        onClick={() => setShow(!show)}
        aria-label={'Toggle field'}
      >
        {show ? (
          <FontAwesomeIcon icon="fa-solid fa-eye" />
        ) : (
          <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
        )}
      </button>
    </div>
  )
}

export default Password
