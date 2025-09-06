import React, { createContext, useContext, useState } from 'react'

import { useWebSocket } from 'hooks/useWebSocket'
import { hostname } from "helpers/hostname"

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
  const [lastMessage, setLastMessage] = useState(null)

  const socketRef = useWebSocket({
    url: hostname('WSS_PROD'),
    onMessage: (message, socket) => {
      setLastMessage(message)

      if (message.cmd === 'ping') {
        socket.send(JSON.stringify({ cmd: 'pong' }))
      }
    }
  })

  return (
    <WebSocketContext.Provider value={{ socketRef, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocketContext = () => useContext(WebSocketContext)
