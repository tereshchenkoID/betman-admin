import React, { createContext, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAuth } from 'hooks/useAuth'
import { useWebSocket } from 'hooks/useWebSocket'
import { setAuth } from 'store/actions/authAction'

import { hostname } from 'helpers/hostname'

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
  const { auth, isAuth } = useAuth()
  const dispatch = useDispatch()
  const [lastMessage, setLastMessage] = useState(null)

  const { socketRef, sendWhenReady } = useWebSocket({
    url: hostname('WSS_PROD'),
    onOpen: (socket) => {
      if (isAuth) {
        socket.send(JSON.stringify({ cmd: 'login', token: auth?.token }))
      }
    },
    onMessage: (message, socket) => {
      setLastMessage(message)
      const { cmd, data, topic } = message

      if (message.cmd === 'ping') {
        socket.send(JSON.stringify({ cmd: 'pong' }))
      }

      if (cmd === 'login' && topic === 'account') {
        dispatch(setAuth(data))
      }

      if (cmd === 'set-credits' && topic === 'account') {
        dispatch(setAuth({ ...auth, credits: data }))
      }
    }
  })

  return (
    <WebSocketContext.Provider value={{ socketRef, sendWhenReady, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocketContext = () => useContext(WebSocketContext)
