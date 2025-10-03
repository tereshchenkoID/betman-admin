import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOutsideClick } from 'hooks/useOutsideClick'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

import { ACCOUNT_TYPE, NAVIGATION } from 'constant/config'

import { setAside } from 'store/actions/asideAction'
import { useAuth } from 'hooks/useAuth'

import Icon from 'components/Icon'
import Logo from 'modules/Logo'

import style from './index.module.scss'

const Nav = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const { auth } = useAuth()
  const role = auth ? auth.role : null

  const MENU = [
    {
      show: true,
      type: [ACCOUNT_TYPE.ADMIN, ACCOUNT_TYPE.AGENT],
      ...NAVIGATION.agents,
    },
    {
      show: true,
      type: [ACCOUNT_TYPE.ADMIN, ACCOUNT_TYPE.AGENT],
      ...NAVIGATION.shops,
    },
    {
      show: true,
      type: [ACCOUNT_TYPE.ADMIN, ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SHOP],
      ...NAVIGATION.cashiers,
    },
    {
      show: true,
      type: [ACCOUNT_TYPE.ADMIN, ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.CASHIER],
      ...NAVIGATION.players,
    },
    {
      text: NAVIGATION.reports.text,
      icon: NAVIGATION.reports.icon,
      show: true,
      submenu: [
        {
          type: [ACCOUNT_TYPE.ADMIN, ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
          ...NAVIGATION.reports.financial,
        },
        // {
        //   type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
        //   ...NAVIGATION.reports.summary,
        // },
        // {
        //   type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
        //   ...NAVIGATION.reports.history,
        // },
        // {
        //   type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
        //   ...NAVIGATION.reports.payments,
        // },
        // {
        //   type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
        //   ...NAVIGATION.reports.bonuses,
        // }
      ],
    },
    {
      text: NAVIGATION.managements.text,
      icon: NAVIGATION.managements.icon,
      show: role === ACCOUNT_TYPE.ADMIN,
      submenu: [
        {
          type: [ACCOUNT_TYPE.ADMIN],
          ...NAVIGATION.managements.promos,
        },
        {
          type: [ACCOUNT_TYPE.ADMIN],
          ...NAVIGATION.managements.banners,
        },
        {
          type: [ACCOUNT_TYPE.ADMIN],
          ...NAVIGATION.managements.jackpots,
        },
        {
          type: [ACCOUNT_TYPE.ADMIN],
          ...NAVIGATION.managements.bonuses,
        }
      ],
    }
  ]

  const [show, setShow] = useState(false)
  const [active, setActive] = useState(false)

  const blockRef = useRef(null)
  const buttonRef = useRef(null)

  const handleOption = (e) => {
    const modules = {
      [ACCOUNT_TYPE.ADMIN]: 'account-agent-edit',
      [ACCOUNT_TYPE.AGENT]: 'account-agent-edit',
      [ACCOUNT_TYPE.SHOP]: 'account-shop-edit',
      [ACCOUNT_TYPE.CASHIER]: 'account-cashier-edit',
      [ACCOUNT_TYPE.PLAYER]: 'account-player-edit',
    }

    dispatch(
      setAside({
        meta: {
          title: t('edit'),
          cmd: modules[role],
          buttonRef: e.target,
        },
        id: auth.id,
      }),
    )
  }

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
        classNames(
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
        <hr/>
        <ul className={style.list}>
          {
            MENU.map((el, idx) =>
              el.show &&
              <li
                key={idx}
                className={
                  classNames(
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
                            dispatch(setAside(null))
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
                              el_s.type.includes(role) &&
                              <Link
                                key={idx_s}
                                to={el_s.link}
                                rel="noreferrer"
                                className={
                                  classNames(
                                    style.link,
                                    pathname === el_s.link && style.active,
                                  )
                                }
                                onClick={() => {
                                  setShow(false)
                                  setActive(false)
                                  dispatch(setAside(null))
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
                      el.type.includes(role) &&
                      <Link
                        to={el.link}
                        rel="noreferrer"
                        className={
                          classNames(
                            style.link,
                            pathname === el.link && style.active,
                          )
                        }
                        onClick={() => {
                          setShow(false)
                          setActive(false)
                          dispatch(setAside(null))
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
        <hr/>
        <div className={style.setting}>
          <Icon
            icon={'fa-gear'}
            alt="settings"
            action={(e) => handleOption(e)}
          />
        </div>
        <hr/>
        <div className={style.action}>
          <button
            ref={buttonRef}
            className={
              classNames(
                style.toggle,
                show && style.active
              )
            }
            type={'button'}
            onClick={() => {
              setShow(!show)
              setActive(!active)
              dispatch(setAside(null))
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
