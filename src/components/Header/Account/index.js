import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutsideClick } from 'hooks/useOutsideClick'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { setAuth } from 'store/actions/authAction'

import style from './index.module.scss'

const Account = () => {
  const { t } = useTranslation()
  const { auth } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const blockRef = useRef(null)
  const buttonRef = useRef(null)
  const [active, setActive] = useState(false)

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

  return (
    <div
      className={style.block}
      ref={blockRef}
    >
      <button
        ref={buttonRef}
        type={'button'}
        className={style.toggle}
        onClick={() => setActive(!active)}
        aria-label={'Toggle'}
      >
        <FontAwesomeIcon icon="fa-solid fa-user" className={style.icon} />
      </button>
      {
        active &&
        <div className={style.wrapper}>
          <div className={style.text}>
            <span>{t('id')}:</span> <strong>{auth.id}</strong>
          </div>
          <div className={style.text}>
            <span>{t('username')}:</span> <strong>{auth.username}</strong>
          </div>
          <div className={style.text}>
            <span>{t('role')}:</span> <strong>{auth.role}</strong>
          </div>
          <ul className={style.ul}>
            <li>
              <button
                type={'button'}
                className={style.link}
                onClick={() => {
                  dispatch(setAuth(null))
                  sessionStorage.clear()
                  setActive(!active)
                }}
              >
                {t('logout')}
              </button>
            </li>
          </ul>
        </div>
      }
    </div>
  )
}

export default Account
