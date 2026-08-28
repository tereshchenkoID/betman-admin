import clsx from 'clsx'

import style from './index.module.scss'

const Button = ({
  type = 'button',
  classes =  ['secondary'],
  children,
  placeholder,
  onChange,
  isDisabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={
        clsx(
          style.block,
          isDisabled && style.disabled,
          classes && classes.map(el => style[el] || el),
        )
      }
      onClick={onChange}
      disabled={isDisabled}
      aria-label={placeholder || 'Button'}
      title={placeholder}
      {...rest}
    >
      { children || placeholder }
    </button>
  )
}

export default Button
