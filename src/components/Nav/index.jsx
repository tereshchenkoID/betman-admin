import {
  useCallback, useMemo, useRef, useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

import { NAVIGATION } from 'src/constant/config'

import { useOutsideClick } from 'src/hooks/useOutsideClick'
import { useAsideStore } from 'src/stores/asideStore'
import { useAuthStore } from 'src/stores/authStore'

import Icon from 'components/Icon'
import Sprite from 'components/Sprite'
import Logo from 'modules/Logo'

import style from './index.module.scss'

export const NavLink = ({ icon, text, link, isActive, onClick }) => {
  const { t } = useTranslation()

  return (
    <Link
      to={link}
      rel="noreferrer"
      className={
        clsx(
          style.link,
          isActive && style.active
        )
      }
      onClick={onClick}
    >
      {
        icon &&
        <Sprite name={icon} />
      }
      <span>{t(text)}</span>
    </Link>
  )
}

const Nav = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { auth } = useAuthStore()
  const { setAside } = useAsideStore()
  const role = auth ? auth.role : null

  const MENU = useMemo(() => {
    const userMenuConfig = auth?.menu
    if (!userMenuConfig) return []

    const dynamicMenu = []

    Object.entries(userMenuConfig).forEach(([key, value]) => {
      if (value === '1') {
        if (NAVIGATION[key]) {
          dynamicMenu.push({ show: true, ...NAVIGATION[key] })
        }
      } else if (typeof value === 'object' && value !== null && NAVIGATION[key]) {
        const submenuItems = []

        Object.entries(value).forEach(([subKey, isAllowed]) => {
          if (isAllowed === '1') {
            const subData = NAVIGATION[key][subKey]
            if (subData) submenuItems.push({ ...subData })
          }
        })

        if (submenuItems.length > 0) {
          dynamicMenu.push({
            show: true,
            text: NAVIGATION[key].text,
            icon: NAVIGATION[key].icon,
            submenu: submenuItems,
          })
        }
      }
    })

    return dynamicMenu
  }, [auth?.menu])

  const [show, setShow] = useState(false)
  const blockRef = useRef(null)
  const buttonRef = useRef(null)

  const closeAll = useCallback(() => {
    if (show) {
      setShow(false)
      setAside(null)
    }

    blockRef.current
      ?.querySelectorAll('details[open]')
      .forEach((el) => el.removeAttribute('open'))
  }, [setAside, show])

  const handleOption = useCallback((e) => {
    if (!role || !auth?.id) return

    setShow(false)
    setAside({
      meta: {
        title: t('edit'),
        cmd: 'user-edit',
        buttonRef: e.target,
      },
      id: auth.id,
    })
  }, [role, auth?.id, t, setAside])

  useOutsideClick(blockRef, closeAll, { meta: { buttonRef } })

  return (
    <nav
      ref={blockRef}
      className={clsx(style.block, show && style.active)}
    >
      <div className={style.wrapper}>
        <div className={style.logo} onClick={closeAll}>
          <Logo />
        </div>
        <hr className={style.divider} />
        <ul className={style.list}>
          {
            MENU.map((el, idx) =>
              <li
                key={idx}
                className={style.item}
              >
                {
                  el.submenu
                    ?
                      <details name="nav-accordion" className={style.details}>
                        <summary
                          className={style.link}
                          onClick={() => setShow(true)}
                        >
                          <Sprite name={el.icon} />
                          <span>{t(el.text)}</span>
                          <Sprite name={'chevron-down'} className={style.arrow} />
                        </summary>
                        <div className={style.submenu}>
                          {
                            el.submenu.map((sub, subIdx) =>
                              <NavLink
                                key={subIdx}
                                icon={sub.icon}
                                text={sub.text}
                                link={sub.link}
                                isActive={pathname === sub.link}
                                onClick={closeAll}
                              />
                            )}
                        </div>
                      </details>
                    :
                      <NavLink
                        icon={el.icon}
                        text={el.text}
                        link={el.link}
                        isActive={pathname === el.link}
                        onClick={closeAll}
                      />
                }
              </li>
          )}
        </ul>
        <hr className={style.divider} />
        <div className={style.setting}>
          <Icon icon={'settings'} alt="settings" action={handleOption} size="30" />
        </div>
        <hr className={style.divider} />
        <div className={style.action}>
          <button
            ref={buttonRef}
            className={
              clsx(
                style.toggle,
                show && style.active
              )
            }
            type={'button'}
            onClick={() => {
              setShow((prev) => !prev)
              setAside(null)
              show && closeAll()
            }}
            aria-label={'Toggle'}
            title={'Toggle'}
          >
            <div className={style.line} />
            <div className={style.line} />
            <div className={style.line} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
