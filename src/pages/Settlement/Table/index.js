import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import { types } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { convertOptions } from 'helpers/convertOptions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Pagination from 'modules/Pagination'
import Dropdown from 'actions/Dropdown'
import Select from 'components/Select'

import style from './index.module.scss'

const Shop = ({ t, data, config_1, config_3, filter }) => {
  const [active, setActive] = useState(false)
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(null)
  const [type, setType] = useState(0)

  const [pagination, setPagination] = useState({
    page: 0,
    pages: 0,
    quantity: 30,
    results: 0,
  })

  const handlePagination = (fieldName, fieldValue) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      [fieldName]: fieldValue,
    }))
  }

  const nextHandleSubmit = () => {
    const next =
      pagination.page < pagination.pages
        ? pagination.page + 1
        : pagination.pages
    handlePagination('page', next)
  }

  const prevHandleSubmit = () => {
    const prev = pagination.page > 0 ? pagination.page - 1 : 0
    handlePagination('page', prev)
  }

  const startHandlerSubmit = () => {
    handlePagination('page', 0)
  }

  const endHandlerSubmit = () => {
    handlePagination('page', pagination.pages)
  }

  const handleSubmit = (
    id = filter.agent.id,
    username = filter.agent.username,
    level = type,
  ) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('id', id)
    formData.append('username', username)
    formData.append('type', level)

    postData('settlement/', formData).then(json => {
      if (json.status === 'OK') {
        setPagination({
          page: 0,
          pages: Math.floor(json.data.length / 30),
          quantity: 30,
          results: json.data.length,
        })

        setTable(json.data)
        setActive(true)
        setLoading(false)
      }
    })
  }

  const handleType = (value, id, username) => {
    if (value !== type) {
      setType(value)
      handleSubmit(id, username, value)
    }
  }

  return (
    <>
      <div className={classNames(style.row, style.sm)}>
        <div className={style.cell}>
          <Dropdown
            data={active}
            action={() => {
              table ? setActive(!active) : handleSubmit(data.id, data.username)
            }}
            loading={loading}
          />
        </div>
        {config_1.map((key, value_idx) => (
          <div key={value_idx} className={style.cell}>
            {data[key.key]}
          </div>
        ))}
        <div className={style.cell}>
          <Select
            options={convertOptions(types.LEVEL_TYPE)}
            data={type}
            onChange={value => handleType(value, data.id, data.username)}
            classes={['sm']}
          />
        </div>
      </div>
      {active && (
        <div className={style.wrapper}>
          {table.length > 0 ? (
            <>
              <Pagination
                position={'top'}
                pagination={pagination}
                nextHandler={nextHandleSubmit}
                prevHandler={prevHandleSubmit}
                startHandlerSubmit={startHandlerSubmit}
                endHandlerSubmit={endHandlerSubmit}
              />
              <div className={style.table}>
                <div className={classNames(style.row, style.headline)}>
                  {config_3.map((key, value_idx) => (
                    <div key={value_idx} className={style.cell}>
                      {t(key.text)}
                    </div>
                  ))}
                </div>
                {table
                  .slice(
                    pagination.page * pagination.quantity,
                    (pagination.page + 1) * pagination.quantity,
                  )
                  .map((el, idx) => (
                    <div key={idx} className={style.row}>
                      {config_3.map((key, value_idx) => (
                        <div key={value_idx} className={style.cell}>
                          {el[key.key]}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
              <Pagination
                position={'bottom'}
                pagination={pagination}
                nextHandler={nextHandleSubmit}
                prevHandler={prevHandleSubmit}
                startHandlerSubmit={startHandlerSubmit}
                endHandlerSubmit={endHandlerSubmit}
              />
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
  )
}

const Option = ({
  t,
  data,
  config_1,
  config_2,
  config_3,
  cmd,
  setCmd,
  filter,
}) => {
  const isShops = data.shops && data.shops.length > 0
  const isClients = data.clients && data.clients.length > 0
  const [activeAccounts, setActiveAccounts] = useState(false)
  const [activeShops, setActiveShops] = useState(false)

  useEffect(() => {
    if (cmd === 'submit') {
      setActiveAccounts(false)
      setActiveShops(false)

      if (data.id === filter.agent.id) {
        setActiveAccounts(true)
        setCmd(false)
      }
    }
    if (cmd === 'reset') {
      setActiveAccounts(false)
      setActiveShops(null)
      setCmd(false)
    }
  }, [cmd])

  return (
    <>
      <div className={classNames(style.row, style.sm)}>
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
                {isShops && (
                  <Dropdown
                    data={activeShops}
                    action={() => setActiveShops(!activeShops)}
                  />
                )}
              </div>
              {config_2.map((key, value) => (
                <div key={value} className={style.cell}>
                  <FontAwesomeIcon
                    icon="fa-solid fa-shop"
                    className={style.icon}
                  />
                  {t('shops')} ({data.shops.length})
                </div>
              ))}
            </div>
            {activeShops && (
              <div className={style.wrapper}>
                {data.shops.map((el, idx) => (
                  <Shop
                    key={idx}
                    t={t}
                    data={el}
                    config_1={config_1}
                    config_3={config_3}
                    filter={filter}
                  />
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
                config_3={config_3}
                cmd={cmd}
                setCmd={setCmd}
                filter={filter}
              />
            ))}
        </div>
      )}
    </>
  )
}

const Table = ({ data, config_1, config_2, config_3, cmd, setCmd, filter }) => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <div className={classNames(style.row, style.sm, style.headline)}>
        <div className={style.cell} />
        {config_1.map((el, idx) => (
          <div key={idx} className={style.cell}>
            {t(el.text)}
          </div>
        ))}
      </div>
      {data.map((el, idx) => (
        <Option
          key={idx}
          t={t}
          data={el}
          config_1={config_1}
          config_2={config_2}
          config_3={config_3}
          cmd={cmd}
          setCmd={setCmd}
          filter={filter}
        />
      ))}
    </div>
  )
}

export default Table
