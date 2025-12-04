import React, { createContext, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'

import { ACCOUNT_TYPE } from 'constant/config'

import { useAuth } from 'hooks/useAuth'
import { useWebSocket } from 'hooks/useWebSocket'
import { setAuth } from 'store/actions/authAction'

import { hostname } from 'helpers/hostname'

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
  const { auth, deleteAuth, isAuth } = useAuth()
  const dispatch = useDispatch()
  const [lastMessage, setLastMessage] = useState(null)

  const { socketRef, sendWhenReady } = useWebSocket({
    url: hostname('WSS_PROD'),
    onOpen: (socket) => {
      if (isAuth) {
        socket.send(JSON.stringify({ cmd: 'login', token: auth?.token }))

        if(auth.role === ACCOUNT_TYPE.CASHIER) {
          socket.send(JSON.stringify({ cmd: 'sub' }))
        }
      }
    },
    onMessage: (message, socket) => {
      setLastMessage(message)
      const { cmd, data, topic } = message

      if (message.cmd === 'ping') {
        socket.send(JSON.stringify({ cmd: 'pong' }))
      }

      if (cmd === 'login' && topic === 'account') {
        dispatch(prev => ({
          ...prev,
          ...data,
          language: prev.language,
        }))
      }

      if (cmd === 'logout') {
        deleteAuth()
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
