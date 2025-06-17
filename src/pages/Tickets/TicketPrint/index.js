import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useTranslation } from 'react-i18next'
import Barcode from 'react-barcode'

import classNames from 'classnames'

import { getDate } from 'helpers/getDate'
import { convertFixed } from 'helpers/convertFixed'

import Button from 'components/Button'

import style from './index.module.scss'

const TicketPrint = ({ data }) => {
  const { t } = useTranslation()
  const [print, setPrint] = useState(false)
  const componentRef = useRef(null)
  const a = useReactToPrint({
    content: () => componentRef.current,
  })

  useEffect(() => {
    print && a()

    return () => {
      setPrint(false)
    }
  }, [print])

  console.log(data)

  return (
    <div className={style.block}>
      <div className={style.wrapper} ref={componentRef}>
        <div className={style.headline}>
          <div className={style.logo}>
            <img src={data.print_logo} alt="Logo" />
          </div>
          <div className={style.meta}>
            <div className={style.row}>
              <div>{t('shop')}:</div>
              <div>
                <strong>{data.username || data.shop}</strong>
              </div>
            </div>
            <div className={style.row}>
              <div>{t('bet')}:</div>
              <div>
                <strong>{getDate(data.placed)}</strong>
              </div>
            </div>
            <div className={style.row}>
              <div>{t('time')}:</div>
              <div>
                <strong>{getDate(data.placed, 'time-local')}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className={style.body}>
          <div className={style.title}>
            {t('ticket')} <strong>#{data.id}</strong>
          </div>
          <div className={style.code}>
            <Barcode value={data.id} displayValue={false} />
          </div>
          {data.group.length > 0 && (
            <div>
              {data.group.map((el, idx) => (
                <div key={idx} className={style.item}>
                  <div className={style.row}>
                    <div>
                      {t('gr')}: <strong>{el.group}</strong>
                    </div>
                    <strong>{convertFixed(el.unit)}</strong>
                  </div>
                  <div className={style.row}>
                    <div>{t('min_max_win')}:</div>
                    <div>
                      {data.currency} <strong>{convertFixed(el.minwin)}</strong>{' '}
                      / {data.currency}{' '}
                      <strong>{convertFixed(el.maxwin)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div>
            {data.bets.map((el, idx) => (
              <div key={idx} className={style.item}>
                <div className={classNames(style.row, style.lg)}>
                  <strong>{el.details.eventId}</strong>
                  {
                    el.details.teams 
                    ?
                      <div>
                        {el.details.teams.home} - {el.details.teams.away}
                      </div>
                    :
                      <div />
                  }
                  <strong>{el.stake}</strong>
                </div>
                <div className={classNames(style.row, style.lg)}>
                  <div>{getDate(el.details.start, 'time-local')}</div>
                  <div>
                    {el.market} : {el.selection}
                  </div>
                  <strong>{el.odds}</strong>
                </div>
              </div>
            ))}
            <div className={style.item}>
              <div className={classNames(style.row, style.sm)}>
                <div>{t('total_stake')}: </div>
                <strong>{data.currency} {data.amount}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.action}>
        <Button
          placeholder={t('print')}
          classes={'primary'}
          onChange={() => setPrint(true)}
        />
      </div>
    </div>
  )
}

export default TicketPrint
