import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

const Toastify = () => {
  const { toastify } = useSelector(state => state.toastify)

  useEffect(() => {
    if (toastify) {
      toast[toastify.type](toastify.text, {})
    }
  }, [toastify])

  return (
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
  )
}

export default Toastify
