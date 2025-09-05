import React from 'react'
import { Link } from 'react-router-dom'

import classNames from 'classnames'

import style from './index.module.scss'

const Reference = ({
  to,
  classes = 'secondary',
  placeholder,
  onChange,
  disabled = false,
  ...rest
}) => {
  return (
    <Link
      to={to}
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
    </Link>
  )
}

export default Reference
