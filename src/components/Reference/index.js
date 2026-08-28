import { Link } from 'react-router-dom'

import clsx from 'clsx'

import style from './index.module.scss'

const Reference = ({
  to,
  classes =  ['secondary'],
  children,
  placeholder,
  onChange,
  isDisabled = false,
  ...rest
}) => {
  return (
    <Link
      to={to}
      className={
        clsx(
          style.block,
          isDisabled && style.disabled,
          classes && classes.map(el => style[el] || el),
        )
      }
      onClick={onChange}
      disabled={isDisabled}
      aria-label={placeholder || 'Reference'}
      title={placeholder}
      {...rest}
    >
      { children || placeholder }
    </Link>
  )
}

export default Reference
