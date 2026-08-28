import { useRef, useState } from 'react'
import clsx from 'clsx'
import i18n from 'i18next'

import { REQUEST_TYPE } from 'src/constant/config'

import { useSettingsStore } from 'src/stores/settingsStore'
import { useAuthStore } from 'src/stores/authStore'

import { useApi } from 'src/hooks/useApi'
import { useOutsideClick } from 'src/hooks/useOutsideClick'

import style from './index.module.scss'

const Language = () => {
  const { auth, updateAuth } = useAuthStore()
  const { request } = useApi()
  const { settings } = useSettingsStore()
  const [active, setActive] = useState(false)
  const blockRef = useRef(null)
  const buttonRef = useRef(null)

  useOutsideClick(
    blockRef,
    () => {
      setActive(false)
    },
    {
      meta: {
        buttonRef: buttonRef,
      },
    },
  )

  const handleChange = async (el) => {
    updateAuth({ language: el })
    i18n.changeLanguage(el.code)
    sessionStorage.setItem('language', JSON.stringify(el))
    setActive(false)

    await request(REQUEST_TYPE.GET, `lang/${el.code}`)
    window.location.reload()
  }

  return (
    <div
      ref={blockRef}
      className={
        clsx(
          style.block,
          Object.values(settings?.languages).length <= 1 && style.disabled,
          active && style.active
        )
      }
      onClick={() => {
        setActive(!active)
      }}
    >
      <div ref={buttonRef} className={style.selected}>
        <span>{auth?.language?.text}</span>
        <img
          className={style.icon}
          src={`/images/countries/${auth?.language?.code}.svg`}
          alt={auth?.language?.code}
          width={20}
          height={15}
          loading="lazy"
        />
      </div>
      {
        active &&
        <div className={style.dropdown}>
          {
            Object.values(settings.languages).map((el, idx) =>
              auth?.language.code !== el.code &&
                <button
                  key={idx}
                  aria-label={el.text}
                  className={style.link}
                  onClick={() => handleChange(el)}
                >
                  {el.text}
                  <img
                    className={style.icon}
                    src={`/images/countries/${el.code}.svg`}
                    alt={el.code}
                    loading="lazy"
                    width={20}
                    height={15}
                  />
                </button>
            )
          }
        </div>
      }
    </div>
  )
}

export default Language
