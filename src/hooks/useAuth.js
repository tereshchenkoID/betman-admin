import { useDispatch, useSelector} from 'react-redux'

import { getData } from 'helpers/api'
import { setAuth } from 'store/actions/authAction'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { auth } = useSelector(state => state.auth)
  const isAuth = auth.id

  const initAuth = (data) => {
    dispatch(setAuth(data))
  }

  const updateAuth = (data) => {
    dispatch(setAuth({ ...auth, ...data }))
  }

  const deleteAuth = () => {
    dispatch(setAuth(null))
    sessionStorage.removeItem('authToken')

    getData('logout/').then(json => {
      window.location.reload()
    })
  }

  return {
    isAuth,
    auth,
    initAuth,
    updateAuth,
    deleteAuth,
  }
}
