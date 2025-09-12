import React, {useEffect, useState} from 'react'

import { useWebSocketContext } from 'context/WebSocketProvider'

import Place from './Place'

import style from './index.module.scss'

const Hall = () => {
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
  )
}

export default Hall
