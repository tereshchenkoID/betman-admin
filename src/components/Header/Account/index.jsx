import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { UserRound } from 'lucide-react'

import { ACCOUNT_TYPE } from 'src/constant/config'

import { useOutsideClick } from 'src/hooks/useOutsideClick'
import { useAuthStore } from 'src/stores/authStore'

import Language from 'components/Header/Language'
import Theme from 'modules/Theme'

import style from './index.module.scss'

const Account = () => {
  const { t } = useTranslation()
  const { auth, deleteAuth } = useAuthStore()
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
        <UserRound size="20" />
      </button>
      <div
        className={
          clsx(
            style.wrapper,
            active && style.active
          )
        }
      >
        <div className={style.header}>
          <div className={style.text}>
            <span>{t('id')}:</span> <strong>{auth.id}</strong>
          </div>
          <div className={style.text}>
            <span>{t('username')}:</span> <strong>{auth.username}</strong>
          </div>
          <div className={style.text}>
            <span>{t('role')}:</span> <strong>{t(`account_types.${ACCOUNT_TYPE[auth?.role]}`)}</strong>
          </div>
        </div>
        <div className={style.options}>
          <div className={style.option}>
            <p className={style.text}>{t('сhose_theme')}:</p>
            <Theme />
          </div>
          <div className={style.option}>
            <p className={style.text}>{t('сhose_language')}:</p>
            <Language />
          </div>
        </div>
        <button
          type={'button'}
          className={style.logout}
          onClick={handleLogout}
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
}

export default Account
