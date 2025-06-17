import { types } from 'store/actionTypes'

const setAuth = data => {
  return {
    type: types.SET_AUTH,
    payload: data,
  }
}

export { setAuth }
