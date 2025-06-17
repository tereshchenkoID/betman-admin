import React from 'react'

import classNames from 'classnames'

import style from './index.module.scss'

const Checkbox = ({ data, placeholder, onChange, classes = null }) => {
  return (
    <label
      className={classNames(
        style.block,
        classes && classes.map(el => style[el]),
      )}
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
      <span>{placeholder}</span>
    </label>
  )
}

export default Checkbox
