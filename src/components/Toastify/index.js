import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useToastifyStore } from 'stores/toastifyStore'

const Toastify = () => {
  const { toastify, clearToastify } = useToastifyStore()

  useEffect(() => {
    if (toastify) {
      toast[toastify.type](toastify.text)
      clearToastify()
    }
  }, [toastify])

  return (
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
  )
}

export default Toastify
