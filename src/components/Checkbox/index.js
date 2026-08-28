import clsx from 'clsx'

import style from './index.module.scss'

const Checkbox = ({
  data,
  placeholder,
  onChange,
  classes = null,
  isRequired = false,
}) => {
  return (
    <label
      className={
        clsx(
          style.block,
          classes && classes.map(el => style[el] || el),
        )
      }
    >
      <input
        type={'checkbox'}
        className={style.input}
        checked={data === '1'}
        onChange={() => {
          onChange(data === '1' ? '0' : '1')
        }}
      />
      <span className={style.item} />
      {
        placeholder &&
        <span>
          {placeholder}
          {isRequired && <span className={style.label}>*</span>}
        </span>
      }
    </label>
  )
}

export default Checkbox
