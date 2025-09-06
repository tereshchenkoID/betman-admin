import { useDispatch, useSelector} from 'react-redux'

import { setAuth } from 'store/actions/authAction'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { auth } = useSelector(state => state.auth)
  const isAuth = auth.id && sessionStorage.getItem('authToken')

  const initAuth = (data) => {
    dispatch(setAuth(data))
  }

  const updateAuth = (data) => {
    dispatch(setAuth({ ...auth, ...data }))
  }

  const deleteAuth = () => {
    dispatch(setAuth(null))
    sessionStorage.removeItem('authToken')
  }

  return {
    isAuth,
    auth,
    initAuth,
    updateAuth,
    deleteAuth,
  }
}
