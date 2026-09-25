import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import { useToastifyStore } from 'src/stores/toastifyStore'

const Toastify = () => {
  const { toastify, clearToastify } = useToastifyStore()

  useEffect(() => {
    if (toastify) {
      toast[toastify.type](toastify.text)
      clearToastify()
    }
  }, [clearToastify, toastify])

  return (
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
  )
}

export default Toastify
