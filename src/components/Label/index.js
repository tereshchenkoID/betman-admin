import React from 'react'

import style from './index.module.scss'

const Label = ({ placeholder }) => {
  return <div className={style.block}>{placeholder}</div>
}

export default Label
