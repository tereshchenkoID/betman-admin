import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOutsideClick } from 'hooks/useOutsideClick'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { types } from 'constant/config'

import classNames from 'classnames'

import { setAside } from 'store/actions/asideAction'

import Toggle from 'components/Toggle'
import Icon from "components/Icon"

import style from './index.module.scss'

const Nav = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const { settings } = useSelector(state => state.settings)
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(false)
  const [data, setData] = useState(null)

  const menu = [
    {
      text: 'accounts',
      icon: 'fa-solid fa-users',
      link: '/accounts',
    },
    {
      text: 'players',
      icon: 'fa-solid fa-users',
      link: '/players',
    },
    {
      text: 'reports',
      icon: 'fa-solid fa-file',
      submenu: [
        {
          text: 'reports',
          link: '/reports',
        },
        {
          text: 'history',
          link: '/history',
        },
        {
          text: 'financial',
          link: '/financial',
        },
      ],
    },
    {
      text: 'account',
      icon: 'fa-solid fa-user',
      submenu: [
        {
          text: 'settings',
          link: '/settings',
        },
      ],
    },
  ]
  const blockRef = useRef(null)
  const buttonRef = useRef(null)

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

  const handleEditUser = (e, type, el = null) => {
    dispatch(
      setAside({
        meta: {
          title: `${t('edit')} ${t(type)}`,
          cmd: 'account-edit-user',
          buttonRef: e.target,
        },
        type: type,
        ...(el || data),
      }),
    )
  }

  return (
    <nav
      ref={blockRef}
      className={classNames(style.block, show && style.active)}
    >
      <div className={style.wrapper}>
        <div className={style.logo}>
          <Link
            to={`/`}
            rel="noreferrer"
            onClick={() => {
              setShow(false)
              dispatch(setAside(null))
              // setActive(false)
            }}
          >
            <img
              src={settings.logo}
              width={42}
              height={42}
              alt="logo"
            />
          </Link>
        </div>
        <hr/>
        <ul className={style.list}>
          {menu.map((el, idx) => (
            <li
              key={idx}
              className={classNames(style.item, idx === active && style.active)}
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
                          dispatch(setAside(null))
                        }}
                      >
                        <FontAwesomeIcon icon={el.icon} className={style.icon}/>
                        <span>{t(el.text)}</span>
                        <FontAwesomeIcon
                          icon="fa-solid fa-angle-down"
                          className={style.arrow}
                        />
                      </span>
                    <div className={style.submenu}>
                      {
                        el.submenu.map((el_s, idx_s) => (
                          <Link
                            key={idx_s}
                            to={el_s.link}
                            rel="noreferrer"
                            className={classNames(
                              style.link,
                              pathname === el_s.link && style.active,
                            )}
                            onClick={() => dispatch(setAside(null))}
                          >
                            {
                              el_s.icon &&
                              <FontAwesomeIcon icon={el_s.icon} className={style.icon}/>
                            }
                            <span>{t(el_s.text)}</span>
                          </Link>
                        ))
                      }
                    </div>
                  </>
                  :
                  <Link
                    to={el.link}
                    rel="noreferrer"
                    className={classNames(
                      style.link,
                      pathname === el.link && style.active,
                    )}
                    onClick={() => dispatch(setAside(null))}
                  >
                    <FontAwesomeIcon icon={el.icon} className={style.icon}/>
                    <span>{t(el.text)}</span>
                  </Link>
              }
            </li>
          ))}
        </ul>
        <hr/>
        <div className={style.setting}>
          <Icon
            icon={'fa-gear'}
            alt={'gear'}
            action={e => handleEditUser(e, types.TYPE[6])}
          />
        </div>
        <hr/>
        <div ref={buttonRef} className={style.action}>
          <Toggle active={show} action={setShow}/>
        </div>
      </div>
    </nav>
  )
}

export default Nav
