import { useEffect, useState } from 'react'
import i18n from 'i18next'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import { Tooltip } from 'react-tooltip'

import 'react-tooltip/dist/react-tooltip.css'

import { useSettingsStore } from 'src/stores/settingsStore'
import { useAuthStore } from 'src/stores/authStore'

import { ThemeProvider } from 'context/ThemeContext'

import Login from 'pages/Login'
import Home from 'pages/Home'
import Toastify from 'components/Toastify'
import Loader from 'components/Loader'

import style from './index.module.scss'

const App = () => {
  const { setAuth, isAuth } = useAuthStore()
  const { setSettings } = useSettingsStore()
  const [loading, setLoading] = useState(true)

  const loadConfig = async () => {
    const response = await fetch('/json/config.json')
    const config = await response.json()
    localStorage.setItem('config', JSON.stringify(config.hostnames))
  }

  const initStores = async () => {
    const [settings, auth] = await Promise.all([
      setSettings(),
      setAuth(),
    ])

    return { settings, auth }
  }

  useEffect(() => {
    const initApp = async () => {
      try {
        await loadConfig()
        const { settings, auth } = await initStores()

        if (settings && auth) {
          const storedLanguage = JSON.parse(sessionStorage.getItem('language'))
          const defaultLanguage = auth?.language?.code
          i18n.changeLanguage(storedLanguage || defaultLanguage || 'ukr')
        }
      } catch (err) {
        console.error('Init error:', err)
      } finally {
        setLoading(false)
      }
    }

    initApp()
  }, [])

  if (loading) return <Loader />

  return (
    <ThemeProvider>
      {
        isAuth()
          ?
            <Home />
          :
            <Login />
      }
      <Toastify />
      <Tooltip
        id={'tooltip'}
        place={'left'}
        className={style.tooltip}
        classNameArrow={style.arrow}
      />
    </ThemeProvider>
  )
}

export default App
library.add(fab, fas, far)
