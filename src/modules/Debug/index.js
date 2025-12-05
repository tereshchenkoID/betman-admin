import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useSettingsStore } from 'stores/settingsStore'

import classNames from 'classnames'

import style from './index.module.scss'

const Debug = ({ data }) => {
  const { settings } = useSettingsStore()
  const [active, setActive] = useState(false)

  if(settings.mode !== 'debug') return

  return (
    <div className={style.block}>
      <button
        type="button"
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
