import { useDispatch } from 'react-redux'

import { setToastify } from 'store/actions/toastifyAction'

export const useNotify = () => {
  const dispatch = useDispatch()

  const notify = (json, message) => {
    dispatch(
      setToastify({
        type: json?.code === '0' ? 'success' : 'error',
        text: json?.message || message,
      })
    )
  }

  return { notify }
}
