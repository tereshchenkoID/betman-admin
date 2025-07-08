import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import classNames from 'classnames'

import { types, service } from 'constant/config'
import { setAside } from 'store/actions/asideAction'

import Icon from 'components/Icon'
import Dropdown from 'actions/Dropdown'
import ReadMore from './ReadMore'

import style from './index.module.scss'

const Option = ({ t, data, filter, config_1, config_2 }) => {
  const dispatch = useDispatch()
  const isShops = data.shops && data.shops.length > 0
  const isClients = data.clients && data.clients.length > 0

  const [activeAccounts, setActiveAccounts] = useState(false)
  const [activeShops, setActiveShops] = useState(false)

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
          title: `${t('new')} ${t(type)}`,
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
          <Dropdown
            data={activeAccounts}
            action={() => setActiveAccounts(!activeAccounts)}
          />
        </div>
        {config_1.map((key, value_idx) => (
          <div
            key={value_idx}
            className={classNames(
              style.cell,
              data[key.key] === '1' && style.warning,
            )}
          >
            {key.key !== 'commission' && key.key !== 'credits' ? (
              key.key === 'locked' ? (
                service.YES_NO[data[key.key]]
              ) : (
                data[key.key]
              )
            ) : (
              <div>{data[key.key] && <ReadMore data={data[key.key]} />}</div>
            )}
          </div>
        ))}
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
      {activeAccounts && (
        <div className={style.wrapper}>
          <>
            <div className={classNames(style.row, style.sm)}>
              <div className={style.cell}>
                {isShops && (
                  <Dropdown
                    data={activeShops}
                    action={() => setActiveShops(!activeShops)}
                  />
                )}
              </div>
              {config_2.map((_, value) => (
                <div key={value} className={style.cell}>
                  <FontAwesomeIcon
                    icon="fa-solid fa-shop"
                    className={style.icon}
                  />
                  {t('shops')} ({data.shops.length})
                </div>
              ))}
              <div className={style.cell}>
                <Icon
                  icon={'fa-add'}
                  action={e => handleNewAgent(e, types.TYPE[1])}
                />
              </div>
            </div>
            {activeShops && (
              <div className={style.wrapper}>
                {data.shops.map((el, idx) => (
                  <div key={idx} className={style.row}>
                    <div className={style.cell} />
                    {config_1.map((key, value_idx) => (
                      <div key={value_idx} className={style.cell}>
                        {key.key !== 'commission' && key.key !== 'credits' ? (
                          key.key === 'locked' ? (
                            service.YES_NO[el[key.key]]
                          ) : (
                            el[key.key]
                          )
                        ) : (
                          <div>
                            {el[key.key] && <ReadMore data={el[key.key]} />}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className={style.cell}>
                      <Icon
                        icon={'fa-pencil'}
                        action={e => handleEditAgent(e, types.TYPE[1], el)}
                      />
                      <Icon
                        icon={'fa-dollar'}
                        action={e =>
                          handleTransferMoney(e, el, {
                            parent_id: data.id,
                            idx: idx,
                          })
                        }
                        alt={'transfer_money'}
                      />
                      <Icon
                        icon={'fa-lock'}
                        action={e => handleChangePassword(e, el)}
                      />
                      <Icon
                        icon={'fa-exchange-alt'}
                        action={e => handleTransferAgent(e, el)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
          {isClients &&
            data.clients.map((el, idx) => (
              <Option
                key={idx}
                t={t}
                data={el}
                config_1={config_1}
                config_2={config_2}
                filter={filter}
              />
            ))}
        </div>
      )}
    </>
  )
}

const Table = ({ data, filter, config_1, config_2 }) => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <div className={classNames(style.row, style.headline)}>
        <div className={style.cell} />
        {config_1.map((el, idx) => (
          <div key={idx} className={style.cell}>
            {t(el.text)}
          </div>
        ))}
        <div className={style.cell} />
      </div>
      {data.length > 0 ? (
        data.map((el, idx) => (
          <Option
            key={idx}
            t={t}
            data={el}
            config_1={config_1}
            config_2={config_2}
            filter={filter}
          />
        ))
      ) : (
        <div className={style.empty}>{t('no_matching_records_found')}</div>
      )}
    </div>
  )
}

export default Table
