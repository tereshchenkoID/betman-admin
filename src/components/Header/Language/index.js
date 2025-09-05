import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import i18n from 'i18next'

import classNames from 'classnames'

import { useOutsideClick } from 'hooks/useOutsideClick'
import { setAuth } from 'store/actions/authAction'

import style from './index.module.scss'

const Language = () => {
  const dispatch = useDispatch()
  const { auth } = useSelector(state => state.auth)
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

  const handleChange = (el) => {
    let a = {
      ...auth,
      language: el
    }

    dispatch(setAuth(a))
    i18n.changeLanguage(el.code)
    sessionStorage.setItem('language', JSON.stringify(el))
    setActive(false)
  }

  console.log(auth)

  return (
    <div
      ref={blockRef}
      className={
        classNames(
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
