import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import classNames from 'classnames'

import style from './index.module.scss'

const Debug = ({ data }) => {
  const { settings } = useSelector(state => state.settings)
  const [active, setActive] = useState(false)

  if(settings.mode !== 'debug') 
    return

  return (
    <div className={style.block}>
      <button
        className={classNames(style.button, active && style.active)}
        onClick={() => setActive(!active)}
      >
        Debug
        <FontAwesomeIcon 
          icon="fa-solid fa-angle-down" 
          className={style.icon} 
        />
      </button>
      {active && (
        <pre className={style.pre}>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  )
}

export default Debug
