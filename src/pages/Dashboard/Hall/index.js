import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAsideStore } from 'stores/asideStore'
import { useAuthStore } from 'stores/authStore'
import { useWebSocketContext } from 'context/WebSocketProvider'

import Paper from 'components/Paper'
import Button from 'components/Button'
import Place from './Place'

import style from './index.module.scss'

const Hall = ({ setActive }) => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const { auth } = useAuthStore()
  const { setAside } = useAsideStore()
  const { lastMessage, sendWhenReady } = useWebSocketContext()

  // useEffect(() => {
  //   return () => {
  //     sendWhenReady(JSON.stringify({ cmd: 'unsub' }))
  //   }
  // }, [])

  useEffect(() => {
    if (!lastMessage) return

    const { cmd, data, topic } = lastMessage

    if ((cmd === 'subscribed' && topic === 'workspace') || (cmd === 'update' && topic === 'workspace')) {
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
              setAside({
                meta: {
                  title: t('add_player'),
                  cmd: 'account-player',
                  buttonRef: e.target,
                },
                id: auth.agent_id
              })
            }}
          />
          <Button
            classes={['primary']}
            placeholder={t('wallet')}
            onChange={(e) => {
              setAside({
                meta: {
                  title: t('wallet'),
                  cmd: 'hall-place-ticket',
                  buttonRef: e.target,
                },
                id: auth.agent_id
              })
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
