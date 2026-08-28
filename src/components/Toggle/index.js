import clsx from 'clsx'

import style from './index.module.scss'

const Toggle = ({
  data,
  placeholder,
  onChange,
  classes = [],
  isRequired = false,
}) => {
  return (
    <label
      className={
        clsx(
          style.block,
          classes && classes.map(el => style[el]),
        )
      }
    >
      {
        placeholder &&
        <span>
          {placeholder}
          {isRequired && <span className={style.label}>*</span>}
        </span>
      }
      <input
        type={'checkbox'}
        className={style.input}
        checked={data === '1'}
        onChange={() => onChange(data === '1' ? '0' : '1')}
      />
      <span className={style.item} />
    </label>
  )
}

export default Toggle
