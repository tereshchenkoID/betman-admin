import React from 'react'

import classNames from 'classnames'

import style from './index.module.scss'

const Plate = ({ data, type = 'error' }) => {

  return (
    <p
      className={
        classNames(
          style.block,
          style[type]
        )
      }
    >
      {data}
    </p>
  )
}

export default Plate
