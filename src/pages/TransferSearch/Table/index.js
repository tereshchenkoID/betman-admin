import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import classNames from 'classnames'

import { types } from 'constant/config'
import { postData } from 'hooks/useRequest'

import Dropdown from 'actions/Dropdown'
import ReadMore from './ReadMore'

import style from './index.module.scss'

const Option = ({ t, data, filter, config_1, config_2, cmd, setCmd }) => {
  const isClients = data.clients && data.clients.length > 0
  const [activeAccounts, setActiveAccounts] = useState(false)
  const [activeTransfer, setActiveTransfer] = useState(false)
  const [transfer, setTransfer] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (
    id = filter.agent.id,
    username = filter.agent.username,
  ) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('id', id)
    formData.append('username', username)
    formData.append('target', filter.target.id)
    formData.append('date-from', filter['date-from'])
    formData.append('date-to', filter['date-to'])
    formData.append('types', filter.types)
    formData.append('amount-from', filter['amount-from'])
    formData.append('amount-to', filter['amount-to'])
    formData.append('currency', filter.currency)

    postData('deposit/search/', formData).then(json => {
      if (json.status === 'OK') {
        setTransfer(json.data)
        setActiveTransfer(true)
        setLoading(false)
      }
    })
  }

  const setFieldValue = (key, el) => {
    switch (key) {
      case 'username':
        return data.username
      case 'target':
        return el[key].username
      case 'type':
        return types.AGENT_TRANSFER_TYPE[el[key]]
      case 'deposit':
        return `${el[key] !== '' ? el.currency : ''} ${el[key]}`
      case 'payout':
        return `${el[key] !== '' ? el.currency : ''} ${el[key]}`
      default:
        return el[key]
    }
  }

  useEffect(() => {
    if (cmd === 'submit') {
      setActiveAccounts(false)
      setActiveTransfer(false)

      if (data.id === filter.agent.id) {
        handleSubmit()
        setActiveAccounts(true)
        setCmd(false)
      }
    }
    if (cmd === 'reset') {
      setActiveAccounts(false)
      setActiveTransfer(false)
      setTransfer(null)
      setCmd(false)
    }
  }, [cmd])

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
          <div key={value_idx} className={style.cell}>
            {data[key.key]}
          </div>
        ))}
      </div>
      {activeAccounts && (
        <div className={style.wrapper}>
          <>
            <div className={classNames(style.row, style.sm)}>
              <div className={style.cell}>
                <Dropdown
                  data={activeTransfer}
                  action={() => {
                    transfer
                      ? setActiveTransfer(!activeTransfer)
                      : handleSubmit(data.id, data.username)
                  }}
                  loading={loading}
                />
              </div>
              {config_2.map((key, value) => (
                <div key={value} className={style.cell}>
                  <FontAwesomeIcon
                    icon="fa-solid fa-shop"
                    className={style.icon}
                  />
                  {t('transfers')}
                </div>
              ))}
            </div>
            {activeTransfer && (
              <div className={style.wrapper}>
                {transfer.transfers.length > 0 ? (
                  <>
                    <div className={classNames(style.row, style.headline)}>
                      <div className={style.cell} />
                      <div className={style.cell}>{data.username}</div>
                      <div className={style.cell} />
                      <div className={style.cell}>{t('total')}</div>
                      <div className={style.cell}>Σ</div>
                      <div className={style.cell} />
                      <div className={style.cell}>
                        <ReadMore data={transfer.total.deposits} />
                      </div>
                      <div className={style.cell}>
                        <ReadMore data={transfer.total.payouts} />
                      </div>
                    </div>
                    {transfer.transfers.map((el, idx) => (
                      <div key={idx} className={style.row}>
                        <div className={style.cell} />
                        {config_1.map((key, value_idx) => (
                          <div key={value_idx} className={style.cell}>
                            {setFieldValue(key.key, el)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className={classNames(style.row, style.wide)}>
                    <div className={style.empty}>
                      {t('no_matching_records_found')}
                    </div>
                  </div>
                )}
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
                cmd={cmd}
                setCmd={setCmd}
              />
            ))}
        </div>
      )}
    </>
  )
}

const Table = ({ data, filter, config_1, config_2, cmd, setCmd }) => {
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
            cmd={cmd}
            setCmd={setCmd}
          />
        ))
      ) : (
        <div className={style.empty}>{t('no_matching_records_found')}</div>
      )}
    </div>
  )
}

export default Table
