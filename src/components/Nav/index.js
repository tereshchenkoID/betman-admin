import { useRef, useState, useMemo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { NAVIGATION } from 'constant/config'

import { useAsideStore } from 'stores/asideStore'
import { useAuthStore } from 'stores/authStore'

import { useOutsideClick } from 'hooks/useOutsideClick'

import Icon from 'components/Icon'
import Logo from 'modules/Logo'

import style from './index.module.scss'

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
      }
      else if (typeof value === 'object' && value !== null && NAVIGATION[key]) {
        const submenuItems = []

        Object.entries(value).forEach(([subKey, isAllowed]) => {
          if (isAllowed === '1') {
            const subData = NAVIGATION[key][subKey]

            if (subData) {
              submenuItems.push({ ...subData })
            }
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
  const [active, setActive] = useState(false)

  const blockRef = useRef(null)
  const buttonRef = useRef(null)

  const handleOption = useCallback((e) => {
    if (!role || !auth?.id) return

    setAside({
      meta: {
        title: t('edit'),
        cmd: 'user-edit',
        buttonRef: e.target,
      },
      id: auth.id,
    })
  }, [role, auth?.id, t, setAside])

  useOutsideClick(
    blockRef,
    () => {
      setShow(false)
      setActive(false)
    },
    {
      ...show,
      meta: {
        buttonRef: buttonRef,
      },
    },
  )

  return (
    <nav
      ref={blockRef}
      className={
        clsx(
          style.block,
          show && style.active
        )
      }
    >
      <div className={style.wrapper}>
        <div
          className={style.logo}
          onClick={() => {
            setShow(false)
            setActive(false)
          }}
        >
          <Logo />
        </div>
        <hr className={style.divider} />
        <ul className={style.list}>
          {
            MENU.map((el, idx) =>
              el.show &&
              <li
                key={idx}
                className={
                  clsx(
                    style.item,
                    idx === active && style.active
                  )
                }
              >
                {
                  el.submenu
                    ?
                    <>
                        <span
                          className={style.link}
                          onClick={() => {
                            setActive(idx)
                            setShow(true)
                            setAside(null)
                          }}
                        >
                          <FontAwesomeIcon
                            icon={el.icon}
                            className={style.icon}
                          />
                          <span>{t(el.text)}</span>
                          <FontAwesomeIcon
                            icon="fa-solid fa-angle-down"
                            className={style.arrow}
                          />
                        </span>
                      <div className={style.submenu}>
                        {
                          el.submenu.map((el_s, idx_s) =>
                            <Link
                              key={idx_s}
                              to={el_s.link}
                              rel="noreferrer"
                              className={
                                clsx(
                                  style.link,
                                  pathname === el_s.link && style.active
                                )
                              }
                              onClick={() => {
                                setShow(false)
                                setActive(false)
                                setAside(null)
                              }}
                            >
                              {
                                el_s.icon &&
                                <FontAwesomeIcon
                                  icon={el_s.icon}
                                  className={style.icon}
                                />
                              }
                              <span>{t(el_s.text)}</span>
                            </Link>
                          )
                        }
                      </div>
                    </>
                    :
                    <Link
                      to={el.link}
                      rel="noreferrer"
                      className={
                        clsx(
                          style.link,
                          pathname === el.link && style.active
                        )
                      }
                      onClick={() => {
                        setShow(false)
                        setActive(false)
                        setAside(null)
                      }}
                    >
                      <FontAwesomeIcon
                        icon={el.icon}
                        className={style.icon}
                      />
                      <span>{t(el.text)}</span>
                    </Link>
                }
              </li>
            )}
        </ul>
        <hr className={style.divider} />
        <div className={style.setting}>
          <Icon
            icon={'fa-gear'}
            alt="settings"
            action={handleOption}
          />
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
              setShow(!show)
              setActive(!active)
              setAside(null)
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
