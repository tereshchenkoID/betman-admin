import React from 'react'
import classNames from "classnames"

import style from './index.module.scss'

const Loader = ({ type = 'default' }) => {
  return (
    <div
      className={
        classNames(
          style.block,
          style[type]
        )
      }
    >
      <div className={style.item} />
    </div>
  )
}

export default Loader
