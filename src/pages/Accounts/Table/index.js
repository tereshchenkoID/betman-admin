import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classNames from 'classnames'

import { types, service } from 'constant/config'
import { setAside } from 'store/actions/asideAction'

import Icon from 'components/Icon'
import Dropdown from 'actions/Dropdown'
import ReadMore from './ReadMore'

import style from './index.module.scss'

const Players = ({ t, data, config_2 }) => {
  return (
    <div className={style.wrapper}>
      <div
        className={
          classNames(
            style.row,
            style.headline,
            style.lg
          )
        }
      >
        {
          config_2.map((el, idx) =>
            <div
              key={idx}
              className={style.cell}
            >
              {t(el.text)}
            </div>
          )
        }
        <div className={style.cell} />
      </div>
      {
        data.players.map((el, idx) =>
          <div
            key={idx}
            className={
              classNames(
                style.row,
                style.lg
              )
            }
          >
            {
              config_2.map((key, idx) => (
                <div
                  key={idx}
                  className={style.cell}
                >
                  {
                    (key.key !== 'commission' && key.key !== 'credits')
                      ?
                        el[key.key]
                      :
                        <div>{el[key.key] && <ReadMore data={el[key.key]} />}</div>
                  }
                </div>
              ))
            }
            <div className={style.cell}>
              <Icon
                icon={'fa-info-circle'}
                alt={'edit'}
              />
              <Icon
                icon={'fa-pencil'}
                alt={'edit'}
              />
              <Icon
                icon={'fa-lock'}
                alt={'lock'}
              />
              <Icon
                icon={'fa-trash'}
                alt={'delete'}
              />
            </div>
          </div>
        )
      }
    </div>
  )
}

const Cashiers = ({ t, data, config_3 }) => {
  return (
    <div className={style.wrapper}>
      <div
        className={
          classNames(
            style.row,
            style.headline,
            style.md
          )
        }
      >
        {
          config_3.map((el, idx) =>
            <div
              key={idx}
              className={style.cell}
            >
              {t(el.text)}
            </div>
          )
        }
        <div className={style.cell} />
      </div>
      {
        data.cashiers.map((el, idx) =>
          <div
            key={idx}
            className={
              classNames(
                style.row,
                style.md
              )
            }
          >
            {
              config_3.map((key, idx) => (
                <div
                  key={idx}
                  className={style.cell}
                >
                  {
                    (key.key !== 'commission' && key.key !== 'credits')
                      ?
                        el[key.key]
                      :
                        <div>{el[key.key] && <ReadMore data={el[key.key]} />}</div>
                  }
                </div>
              ))
            }
            <div className={style.cell}>
              <Icon
                icon={'fa-pencil'}
                alt={'edit'}
              />
              <Icon
                icon={'fa-lock'}
                alt={'lock'}
              />
              <Icon
                icon={'fa-trash'}
                alt={'delete'}
              />
            </div>
          </div>
        )
      }
    </div>
  )
}

const Shop = ({ t, data, config_1, config_2, config_3 }) => {
  const [active, setActive] = useState(false)
  const [activePlayers, setActivePlayers] = useState(false)
  const [activeCashiers, setActiveCashiers] = useState(false)

  const isPlayers = data.players && data.players.length > 0
  const isCashiers = data.cashiers && data.cashiers.length > 0

  return (
    <div className={style.wrapper}>
      <div className={style.row}>
        <div className={style.cell}>
          <Dropdown
            data={active}
            action={() => setActive(!active)}
          />
        </div>
          {
            config_1.map((key, idx) => (
            <div
              key={idx}
              className={style.cell}
            >
              {
                idx === 0 &&
                <FontAwesomeIcon
                  icon="fa-solid fa-shop"
                  className={style.icon}
                />
              }
              {
                (key.key !== 'commission' && key.key !== 'credits')
                  ?
                    key.key === 'locked' ? service.YES_NO[data[key.key]] : data[key.key]
                  :
                    <div>{data[key.key] && <ReadMore data={data[key.key]} />}</div>
              }
            </div>
          ))
        }
        <div className={style.cell}>
          <Icon
            icon={'fa-dollar'}
            alt={'transfer_money'}
          />
          <Icon
            icon={'fa-lock'}
            alt={'lock'}
          />
          <Icon
            icon={'fa-trash'}
            alt={'delete'}
          />
        </div>
      </div>
      {
        active &&
        <>
          <div className={style.wrapper}>
            <div
              className={
                classNames(
                  style.row,
                  style.sm
                )
              }
            >
              <div className={style.cell}>
                {
                  isCashiers &&
                  <Dropdown
                    data={activeCashiers}
                    action={() => setActiveCashiers(!activeCashiers)}
                  />
                }
              </div>
              <div className={style.cell}>
                <FontAwesomeIcon
                  icon="fa-solid fa-cash-register"
                  className={style.icon}
                />
                {t('cashiers')} ({data.cashiers.length})
              </div>
              <div className={style.cell}>
                <Icon
                  icon={'fa-add'}
                />
              </div>
            </div>
          </div>
          {
            activeCashiers &&
            <Cashiers
              t={t}
              data={data}
              config_3={config_3}
            />
          }
          <div className={style.wrapper}>
            <div
              className={
                classNames(
                  style.row,
                  style.sm
                )
              }
            >
              <div className={style.cell}>
                {
                  isPlayers &&
                  <Dropdown
                    data={activePlayers}
                    action={() => setActivePlayers(!activePlayers)}
                  />
                }
              </div>
              <div className={style.cell}>
                <FontAwesomeIcon
                  icon="fa-solid fa-users"
                  className={style.icon}
                />
                {t('players')} ({data.players.length})
              </div>
              <div className={style.cell}>
                <Icon
                  icon={'fa-add'}
                  alt={'add'}
                />
              </div>
            </div>
            {
              activePlayers &&
              <Players
                t={t}
                data={data}
                config_2={config_2}
              />
            }
          </div>
        </>
      }
    </div>
  )
}

const Subagent = ({ t, data, config_1, config_2, config_3 }) => {
  const isShops = data.shops && data.shops.length > 0
  const [activeShops, setActiveShops] = useState(false)

  return (
    <div className={style.wrapper}>
      <div className={style.row}>
        <div className={style.cell}>
          {
            isShops &&
            <Dropdown
              data={activeShops}
              action={() => setActiveShops(!activeShops)}
            />
          }
        </div>
        {
          config_1.map((key, idx) => (
            <div
              key={idx}
              className={classNames(
                style.cell,
                data[key.key] === '1' && style.warning,
              )}
            >
              {
                idx === 0 &&
                <FontAwesomeIcon
                  icon="fa-solid fa-user-tie"
                  className={style.icon}
                />
              }
              {
                (key.key !== 'commission' && key.key !== 'credits')
                  ?
                    key.key === 'locked' ? service.YES_NO[data[key.key]] : data[key.key]
                  :
                    <div>{data[key.key] && <ReadMore data={data[key.key]} />}</div>
              }
            </div>
          ))
        }
        <div className={style.cell}>
          <Icon
            icon={'fa-add'}
            alt={'add'}
          />
          <Icon
            icon={'fa-pencil'}
            alt={'edit'}
          />
          <Icon
            icon={'fa-lock'}
            alt={'lock'}
          />
          <Icon
            icon={'fa-trash'}
            alt={'delete'}
          />
        </div>
      </div>
      {
        activeShops &&
        data.shops.map((el, idx) =>
          <Shop
            key={idx}
            t={t}
            data={el}
            config_1={config_1}
            config_2={config_2}
            config_3={config_3}
          />
        )
      }
    </div>
  )
}

const Option = ({ t, data, config_1, config_2, config_3 }) => {
  const dispatch = useDispatch()
  const isClients = data.subagent && data.subagent.length > 0

  const [activeAccounts, setActiveAccounts] = useState(false)

  const handleTransferMoney = (e, value, parent = null) => {
    dispatch(
      setAside({
        meta: {
          title: t('transfer_money'),
          cmd: 'account-transfer-money',
          buttonRef: e.target,
        },
        parent: parent,
        ...(value || data),
      }),
    )
  }

  const handleChangePassword = (e, value) => {
    dispatch(
      setAside({
        meta: {
          title: t('change_password'),
          cmd: 'account-change-password',
          buttonRef: e.target,
        },
        ...(value || data),
      }),
    )
  }

  const handleTransferAgent = (e, value) => {
    dispatch(
      setAside({
        meta: {
          title: t('transfer_agent'),
          cmd: 'account-transfer-agent',
          buttonRef: e.target,
        },
        ...(value || data),
      }),
    )
  }

  const handleEditAgent = (e, type, el = null) => {
    dispatch(
      setAside({
        meta: {
          title: `${t('edit')} ${t(type)}`,
          cmd: 'account-edit-agent',
          buttonRef: e.target,
        },
        type: type,
        ...(el || data),
      }),
    )
  }

  const handleNewAgent = (e, type) => {
    dispatch(
      setAside({
        meta: {
          title: `${t('new_player')}`,
          cmd: 'account-new-agent',
          buttonRef: e.target,
        },
        type: type,
        ...data,
      }),
    )
  }

  return (
    <>
      <div className={style.row}>
        <div className={style.cell}>
          {
            isClients &&
            <Dropdown
              data={activeAccounts}
              action={() => setActiveAccounts(!activeAccounts)}
            />
          }
        </div>
        {
          config_1.map((key, idx) => (
            <div
              key={idx}
              className={
                classNames(
                  style.cell,
                  data[key.key] === '1' && style.warning,
                )
              }
            >
              {
                (key.key !== 'commission' && key.key !== 'credits')
                  ?
                    key.key === 'locked' ? service.YES_NO[data[key.key]] : data[key.key]
                  :
                    <div>{data[key.key] && <ReadMore data={data[key.key]} />}</div>
              }
            </div>
          ))
        }
        <div className={style.cell}>
          <Icon
            icon={'fa-add'}
            action={e => handleNewAgent(e, types.TYPE[0])}
            alt={'add_agent'}
          />
          <Icon
            icon={'fa-pencil'}
            action={e => handleEditAgent(e, types.TYPE[0])}
            alt={'edit_agent'}
          />
          <Icon
            icon={'fa-dollar'}
            action={e => handleTransferMoney(e)}
            alt={'transfer_money'}
          />
          <Icon
            icon={'fa-lock'}
            action={e => handleChangePassword(e)}
            alt={'change_password'}
          />
          <Icon
            icon={'fa-exchange-alt'}
            action={e => handleTransferAgent(e)}
            alt={'transfer_agent'}
          />
        </div>
      </div>
      {
        activeAccounts &&
        <div className={style.wrapper}>
          {
            isClients &&
            data.subagent.map((el, idx) =>
              <Subagent
                key={idx}
                t={t}
                data={el}
                config_1={config_1}
                config_2={config_2}
                config_3={config_3}
              />
            )
          }
        </div>
      }
    </>
  )
}

const Table = ({ data, filter, config_1, config_2, config_3 }) => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <div
        className={
          classNames(
            style.row,
            style.headline
          )
        }
      >
        <div className={style.cell} />
        {
          config_1.map((el, idx) =>
            <div
              key={idx}
              className={style.cell}
            >
              {t(el.text)}
            </div>
          )
        }
        <div className={style.cell} />
      </div>
      {
        data.length > 0
          ?
            data.map((el, idx) =>
              <Option
                key={idx}
                t={t}
                data={el}
                config_1={config_1}
                config_2={config_2}
                config_3={config_3}
                filter={filter}
              />
            )
          :
            <div className={style.empty}>{t('no_matching_records_found')}</div>
      }
    </div>
  )
}

export default Table

// Shop
// filters: Subagent, Date create,


// Players
// filters: Subagent, Shop, Date create, Date last played, Date last deposit

// Cashier
// filters: Subagent, Shop, Date create, Date last played, Date last deposit, withdrawal


// Agent - 0
// Subagent - 1
// Shop - 2
// Cashier - 3
// Players - 4
