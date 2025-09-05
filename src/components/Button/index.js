import React from 'react'

import classNames from 'classnames'

import style from './index.module.scss'

const Button = ({
  type = 'button',
  classes = 'secondary',
  placeholder,
  onChange,
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={
        classNames(
          style.block,
          disabled && style.disabled,
          style[classes]
        )
      }
      onClick={onChange}
      aria-label={placeholder}
      title={placeholder}
      {...rest}
    >
      {placeholder}
    </button>
  )
}

export default Button
