import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from 'clsx'

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
        <FontAwesomeIcon
          className={style.icon}
          icon="fa-solid fa-moon"
        />
        <FontAwesomeIcon
          className={style.icon}
          icon="fa-solid fa-sun"
        />
      </span>
    </label>
  )
}

export default Theme
