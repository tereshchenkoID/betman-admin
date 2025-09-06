import { useEffect, useRef } from 'react'

export const useWebSocket = ({ url, onMessage, onOpen, onError, onClose, reconnectDelay = 3000 }) => {
  const socketRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const savedOnMessage = useRef(onMessage)
  const savedOnOpen = useRef(onOpen)
  const savedOnError = useRef(onError)
  const savedOnClose = useRef(onClose)

  useEffect(() => {
    savedOnMessage.current = onMessage
    savedOnOpen.current = onOpen
    savedOnError.current = onError
    savedOnClose.current = onClose
  }, [onMessage, onOpen, onError, onClose])

  useEffect(() => {
    let isUnmounted = false

    const connect = () => {
      if (isUnmounted) return

      const socket = new WebSocket(url)
      socketRef.current = socket

      socket.onopen = () => {
        console.log('WebSocket connected')
        savedOnOpen.current?.(socket)
      }

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          savedOnMessage.current?.(message, socket)
        } catch (e) {
          console.error('Invalid JSON:', event.data)
        }
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
        savedOnError.current?.(error)
      }

      socket.onclose = (event) => {
        console.warn('WebSocket closed, reconnecting...', event.reason)
        savedOnClose.current?.(event)

        if (!isUnmounted) {
          reconnectTimeoutRef.current = setTimeout(connect, reconnectDelay)
        }
      }
    }

    connect()

    return () => {
      isUnmounted = true
      clearTimeout(reconnectTimeoutRef.current)
      socketRef.current?.close()
    }
  }, [url, reconnectDelay])

  return socketRef
}
