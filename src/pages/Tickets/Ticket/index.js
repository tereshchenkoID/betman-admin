import React, { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { statuses } from 'constant/config'

import classNames from 'classnames'

import { getData, postData } from 'hooks/useRequest'
import { setAside } from 'store/actions/asideAction'
import { setToastify } from 'store/actions/toastifyAction'
import { convertFixed } from 'helpers/convertFixed'
import { convertOptions } from 'helpers/convertOptions'

import Textarea from 'components/Textarea'
import Select from 'components/Select'
import Icon from 'components/Icon'
import Dropdown from 'actions/Dropdown'
import Calculate from './Calculate'
import Cancel from './Cancel'

import style from './index.module.scss'

const Ticket = ({ data, action, config_1, config_2, config_3 }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [table, setTable] = useState(null)
  const [active, setActive] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [calculate, setCalculate] = useState(false)
  const [loading, setLoading] = useState(false)

  const risk = useMemo(() => {
    return Number(data['stake']) * 10 < Number(data['payout'])
  }, [data])

  const win = useMemo(() => {
    return Number(data['payout']) > 0
  }, [data])

  const handleDetails = () => {
    if (active) {
      setActive(false)
    } else {
      if (table) {
        setActive(true)
      } else {
        setLoading(true)
        getData(`tickets/details/?id=${data.ticketId}`).then(json => {
          if (json.status === 'OK') {
            setTable(json)
            setActive(true)
            setLoading(false)
          }
        })
      }
    }
  }

  const handleCancelled = () => {
    getData(`tickets/cancel/?id=${data.ticketId}`).then(json => {
      if (json.status === 'OK') {
        if (json.data[0].code === '0') {
          const newData = data
          newData.status = 13

          action(prevData => ({
            ...prevData,
            [data]: newData,
          }))

          dispatch(
            setToastify({
              type: 'success',
              text: json.data[0].message,
            }),
          )
        } else {
          dispatch(
            setToastify({
              type: 'error',
              text: json.data[0].error_message,
            }),
          )
        }

        setCancel(false)
      }
    })
  }

  const handleCalculate = () => {
    const formData = {
      action: 'save',
      ...table.data[0],
    }

    postData(
      `tickets/calculate/?id=${data.ticketId}`,
      JSON.stringify(formData),
    ).then(json => {
      if (json.status === 'OK') {
        if (json.data[0].code === '0') {
          dispatch(
            setToastify({
              type: 'success',
              text: json.data[0].message,
            }),
          )
        } else {
          dispatch(
            setToastify({
              type: 'error',
              text: json.data[0].error_message,
            }),
          )
        }
        setCalculate(!calculate)
      }
    })
  }

  const handleChange = (array, key, value) => {
    const newData = array
    array[key] = value

    action(prevData => ({
      ...prevData,
      [array]: newData,
    }))
  }

  const handlePrint = e => {
    if (table) {
      dispatch(
        setAside({
          meta: {
            title: t('ticket_print'),
            cmd: 'ticket-print',
            buttonRef: e.target,
          },
          shop: data.username,
          ...table.data[0],
        }),
      )
    } else {
      getData(`tickets/details/?id=${data.ticketId}`).then(json => {
        if (json.status === 'OK') {
          setTable(json)

          dispatch(
            setAside({
              meta: {
                title: t('ticket_print'),
                cmd: 'ticket-print',
                buttonRef: e.target,
              },
              shop: data.username,
              ...json.data[0],
            }),
          )
        }
      })
    }
  }

  return (
    <div
      className={
        classNames(
          style.block,
          risk && style.highlight,
          win && style.win,
          active && style.active
        )
      }
    >
      <div className={style.row}>
        <div className={style.cell}>
          <Dropdown
            data={active}
            disabled={calculate}
            action={() => {
              handleDetails()
            }}
            loading={loading}
          />
        </div>
        {config_1.map((el, idx) => (
          <div key={idx} className={style.cell}>
            {el.key === 'status' ? (
              calculate ? (
                <Select
                  options={convertOptions(statuses.TICKET_STATUSES)}
                  data={data[el.key]}
                  onChange={value => handleChange(data, el.key, value)}
                  classes={['sm']}
                />
              ) : (
                statuses.TICKET_STATUSES[data[el.key]]
              )
            ) : (
              data[el.key]
            )}
          </div>
        ))}
        <div className={style.cell}>
          {
            data['calculate'] === '1' &&
            <Cancel
              data={cancel}
              action={handleCancelled}
              alt={t('cancel')}
              setCancel={() => {
                setCancel(!cancel)
              }}
            />
          }
          <Icon
            icon={'fa-print'}
            alt={t('print')}
            action={e => handlePrint(e)}
          />
          {
            data['calculate'] === '1' &&
            <Calculate
              data={calculate}
              active={active}
              action={handleCalculate}
              setCalculate={() => {
                setCalculate(!calculate)
              }}
            />
          }
        </div>
      </div>
      {active && (
        <div className={style.dropdown}>
          {table.data[0].group.length > 0 && (
            <div className={classNames(style.table, style.sm)}>
              <div className={classNames(style.row, style.headline)}>
                {config_2.map((el, idx) => (
                  <div key={idx} className={style.cell}>
                    {t(el.text)}
                  </div>
                ))}
              </div>
              {table.data[0].group.map((el, idx) => (
                <div key={idx} className={style.row}>
                  <div className={style.cell}>{el.group}</div>
                  <div className={style.cell}>{el.combi}</div>
                  <div className={style.cell}>{convertFixed(el.amount)}</div>
                  <div className={style.cell}>{convertFixed(el.minwin)}</div>
                  <div className={style.cell}>{convertFixed(el.maxwin)}</div>
                  <div className={style.cell}>{el.bonus}</div>
                </div>
              ))}
            </div>
          )}
          <div className={classNames(style.table, style.lg)}>
            <div className={classNames(style.row, style.headline)}>
              {config_3.map((el, idx) => (
                <div key={idx} className={style.cell}>
                  {t(el.text)}
                </div>
              ))}
            </div>
            {table.data[0].bets.map((el, idx) => (
              <div key={idx} className={style.row}>
                <div className={style.cell}>{el.details.game}</div>
                <div className={style.cell}>{el.details.eventId}</div>
                <div className={style.cell}>
                  {
                    el.details.teams 
                    ?
                      <>
                        {el.details.teams.home} - {el.details.teams.away}
                      </>
                    :
                      <>-</>
                  }
                </div>
                <div className={style.cell}>{el.market}</div>
                <div className={style.cell}>{el.selection}</div>
                <div className={style.cell}>{el.odds}</div>
                <div className={style.cell}>
                  {calculate ? (
                    <Textarea
                      data={el.details.results.join(' - ')}
                      onChange={value =>
                        handleChange(
                          el.details,
                          'results',
                          value.replaceAll(' ', '').split('-'),
                        )
                      }
                      classes={['sm']}
                    />
                  ) : (
                    el.details.results.join(' - ')
                  )}
                </div>
                <div className={style.cell}>
                  {calculate ? (
                    <Select
                      options={convertOptions(statuses.STAKE_STATUSES)}
                      data={el.status}
                      onChange={value => handleChange(el, 'status', value)}
                      classes={['sm']}
                    />
                  ) : (
                    statuses.STAKE_STATUSES[el.status]
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Ticket
