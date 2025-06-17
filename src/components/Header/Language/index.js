import React, { useRef, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import i18n from 'i18next'

import classNames from 'classnames'

import { useOutsideClick } from 'hooks/useOutsideClick'

import style from './index.module.scss'

const Language = () => {
  const { settings } = useSelector(state => state.settings)
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

  const currentLanguage = useMemo(
    () => settings?.languages?.find(lang => lang.code === i18n.language) || 'en',
    [settings.languages]
  )
  
  return (
    <div
      ref={blockRef}
      className={
        classNames(
          style.block,
          settings?.languages?.length <= 1 && style.disabled,
          active && style.active
        )
      }
      onClick={() => {
        setActive(!active)
      }}
    >
      <div ref={buttonRef} className={style.selected}>
        <span>{currentLanguage?.text}</span>
        <img
          className={style.icon}
          src={`/images/countries/${currentLanguage?.text}.svg`} 
          alt={currentLanguage?.text}
          width={20}
          height={15}
        />
      </div>
      {
        active && 
        <div className={style.dropdown}>
          {settings.languages.map(
            (el, idx) =>
              i18n.language !== el.code && (
                <button
                  key={idx}
                  aria-label={el.text}
                  className={style.link}
                  onClick={() => {
                    sessionStorage.setItem('language', el.code)
                    i18n.changeLanguage(el.code)
                  }}
                >
                  <img
                    className={style.icon}
                    src={`/images/countries/${el.code}.svg`} 
                    alt={el.code}
                  />
                  {el.text}
                </button>
              ),
          )}
        </div>
      }
    </div>
  )
}

export default Language
