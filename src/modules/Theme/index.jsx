import clsx from 'clsx'

import { useTheme } from 'context/ThemeContext'

import Sprite from 'components/Sprite'

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
        <Sprite name="moon" size="20" className={style.icon} />
        <Sprite name="sun" size="20" className={style.icon} />
      </span>
    </label>
  )
}

export default Theme
