import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutsideClick } from 'hooks/useOutsideClick'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAuth } from 'hooks/useAuth'
import { role } from 'helpers/role'

import style from './index.module.scss'

const Account = () => {
  const { t } = useTranslation()
  const { auth, deleteAuth } = useAuth()
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

  const handleLogout = () => {
    setActive(false)
    deleteAuth()
  }

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
        <FontAwesomeIcon
          icon="fa-solid fa-user"
          className={style.icon}
        />
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
            <span>{t('role')}:</span> <strong>{role(auth.role)}</strong>
          </div>
          <ul className={style.ul}>
            <li>
              <button
                type={'button'}
                className={style.link}
                onClick={handleLogout}
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
