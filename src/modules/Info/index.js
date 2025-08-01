import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import style from './index.module.scss'

const Info = ({ text, tooltip, place = 'left' }) => {
  return (
    <p className={style.block}>
      {text}
      <FontAwesomeIcon
        data-tooltip-id="tooltip"
        data-tooltip-content={tooltip}
        data-tooltip-place={place}
        icon="fa-solid fa-circle-question"
        className={style.icon}
      />
    </p>
  )
}

export default Info
