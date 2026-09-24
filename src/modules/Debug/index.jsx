import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

import { useSettingsStore } from 'src/stores/settingsStore'

import style from './index.module.scss'

const Debug = ({ data }) => {
  const { settings } = useSettingsStore()
  const [active, setActive] = useState(false)

  if(settings.mode !== 'debug') return

  return (
    <div className={style.block}>
      <button
        type="button"
        className={clsx(style.button, active && style.active)}
        onClick={() => setActive(!active)}
      >
        Debug
        <ChevronDown size="14" className={style.icon} />
      </button>
      {
        active &&
        <pre className={style.pre}>{JSON.stringify(data, null, 2)}</pre>
      }
    </div>
  )
}

export default Debug
