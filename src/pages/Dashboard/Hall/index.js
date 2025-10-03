import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWebSocketContext } from 'context/WebSocketProvider'

import Place from './Place'
import Paper from 'components/Paper'

import style from './index.module.scss'

const Hall = () => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
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
        {
          data?.map((item, index) =>
            <Place
              key={index}
              info={item}
            />
          )
        }
      </div>
    </Paper>
  )
}

export default Hall
