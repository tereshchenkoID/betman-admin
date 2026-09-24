import clsx from 'clsx'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from 'context/ThemeContext'

import style from './index.module.scss'

const Theme = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <label
      className={
        clsx(
          style.block,
          style[theme]
        )
      }
    >
      <input
        type="checkbox"
        className={style.input}
        onChange={toggleTheme}
        checked={theme === 'light'}
      />
      <span className={style.label} />
      <span className={style.icons}>
        <Moon size="20" className={style.icon} />
        <Sun size="20" className={style.icon} />
      </span>
    </label>
  )
}

export default Theme
