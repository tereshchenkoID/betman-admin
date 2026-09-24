import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

import i18n from 'i18next'

import { LANGUAGE } from 'constant/config'

import { ThemeProvider } from 'context/ThemeContext'
import { useAuthStore } from 'src/stores/authStore'
import { useSettingsStore } from 'src/stores/settingsStore'

import Loader from 'components/Loader'
import Toastify from 'components/Toastify'

import 'react-tooltip/dist/react-tooltip.css'
import style from './index.module.scss'

const App = () => {
  const { setAuth } = useAuthStore()
  const { setSettings } = useSettingsStore()
  const [loading, setLoading] = useState(true)

  const loadConfig = async () => {
    const response = await fetch('/json/config.json')
    const config = await response.json()
    localStorage.setItem('config', JSON.stringify(config.hostnames))
  }

  const initStores = async () => {
    const [
      settings,
      auth
    ] = await Promise.all([
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
          await i18n.changeLanguage(storedLanguage || defaultLanguage || LANGUAGE)
        }
      } catch (err) {
        await i18n.changeLanguage('en')
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
      <Outlet />
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
