import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOutsideClick } from 'hooks/useOutsideClick'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

import { ACCOUNT_TYPE, NAVIGATION } from 'constant/config'

import { setAside } from 'store/actions/asideAction'

import Icon from "components/Icon"

import style from './index.module.scss'

const MENU = [
  {
    type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SUBAGENT],
    ...NAVIGATION.agents,
  },
  {
    type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SUBAGENT],
    ...NAVIGATION.shops,
  },
  {
    type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SUBAGENT, ACCOUNT_TYPE.SHOP],
    ...NAVIGATION.cashiers,
  },
  {
    type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SUBAGENT, ACCOUNT_TYPE.SHOP],
    ...NAVIGATION.players,
  },
  {
    text: 'reports',
    icon: 'fa-solid fa-file',
    submenu: [
      {
        type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SUBAGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
        ...NAVIGATION.summary,
      },
      {
        type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SUBAGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
        ...NAVIGATION.history,
      },
      {
        type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SUBAGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
        ...NAVIGATION.financial,
      }
    ],
  },
  {
    text: 'account',
    icon: 'fa-solid fa-user',
    submenu: [
      {
        type: [ACCOUNT_TYPE.AGENT, ACCOUNT_TYPE.SUBAGENT, ACCOUNT_TYPE.SHOP, ACCOUNT_TYPE.PLAYER, ACCOUNT_TYPE.CASHIER],
        ...NAVIGATION.settings,
      }
    ],
  },
]

const Nav = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const { settings } = useSelector(state => state.settings)
  const { auth } = useSelector(state => state.auth)
  const role = auth ? auth.role : null

  const [show, setShow] = useState(false)
  const [active, setActive] = useState(false)

  const blockRef = useRef(null)
  const buttonRef = useRef(null)

  const handleOption = (e) => {
    const modules = {
      [ACCOUNT_TYPE.AGENT]: 'account-agent-edit',
      [ACCOUNT_TYPE.SHOP]: 'account-shop-edit',
      [ACCOUNT_TYPE.CASHIER]: 'account-cashier-edit',
      [ACCOUNT_TYPE.PLAYER]: 'account-player-edit',
    }

    dispatch(
      setAside({
        meta: {
          title: t('edit_user'),
          cmd: modules[role],
          buttonRef: e.target,
        }
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
        <div className={style.logo}>
          <Link
            to={NAVIGATION.home.link}
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
          {
            MENU.map((el, idx) =>
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
                              onClick={() => dispatch(setAside(null))}
                            >
                              {
                                el_s.icon &&
                                <FontAwesomeIcon icon={el_s.icon} className={style.icon}/>
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
                      onClick={() => dispatch(setAside(null))}
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
            alt={'gear'}
            action={(e) => handleOption(e)}
          />
        </div>
        <hr/>
        <div

          className={style.action}
        >
          <button
            ref={buttonRef}
            className={
              classNames(
                style.toggle,
                show && style.active
              )
            }
            type={'button'}
            onClick={() => setShow(!show)}
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
