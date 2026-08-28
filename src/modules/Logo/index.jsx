import { Link } from 'react-router-dom'

import { NAVIGATION } from 'src/constant/config'

import { useSettingsStore } from 'src/stores/settingsStore'
import { useAsideStore } from 'src/stores/asideStore'

import style from './index.module.scss'

const Logo = () => {
  const { settings } = useSettingsStore()
  const { setAside } = useAsideStore()

  return (
    <Link
      to={NAVIGATION.home.link}
      rel="noreferrer"
      className={style.block}
      onClick={() => {
        setAside(null)
      }}
    >
      <img
        src={settings?.assets?.logo}
        width={42}
        height={42}
        alt="logo"
      />
    </Link>
  )
}

export default Logo
