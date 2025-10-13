import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux';

import { useAuth } from 'hooks/useAuth'
import { useWebSocketContext } from 'context/WebSocketProvider'
import { setAside } from 'store/actions/asideAction'

import Place from './Place'
import Paper from 'components/Paper'
import Button from 'components/Button'

import style from './index.module.scss'

const Hall = ({ active, setActive }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const { auth } = useAuth()
  const { lastMessage, sendWhenReady } = useWebSocketContext()

  useEffect(() => {
    sendWhenReady(JSON.stringify({ cmd: 'sub' }))

    return () => {
      sendWhenReady(JSON.stringify({ cmd: 'unsub' }))
    }
  }, [])

  useEffect(() => {
    if (!lastMessage) return

    const { cmd, data, topic } = lastMessage

    if (
      (cmd === 'subscribed' && topic === 'workspace') ||
      (cmd === 'update' && topic === 'workspace')
    ) {
      setData(data)
    }
  }, [lastMessage])

  return (
    <Paper headline={t('game_hall')} classes={['sm']}>
      <div className={style.block}>
        <div className={style.actions}>
          <Button
            classes={['primary']}
            placeholder={t('add_player')}
            onChange={(e) => {
              dispatch(
                setAside({
                  meta: {
                    title: t('add_player'),
                    cmd: 'account-player',
                    buttonRef: e.target,
                  },
                  id: auth.agent_id
                }),
              )
            }}
          />
          <Button
            classes={['primary']}
            placeholder={t('wallet')}
            onChange={(e) => {
              dispatch(
                setAside({
                  meta: {
                    title: t('wallet'),
                    cmd: 'hall-place-ticket',
                    buttonRef: e.target,
                  },
                  id: auth.agent_id
                }),
              )
            }}
          />
          <Button
            classes={['error']}
            placeholder={t('close_day')}
            onChange={() => setActive(false)}
          />
        </div>
        <div className={style.grid}>
          {
            data?.map((item, index) =>
              <Place
                key={index}
                info={item}
              />
            )
          }
        </div>
      </div>
    </Paper>
  )
}

export default Hall
