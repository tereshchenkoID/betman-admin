import { types } from 'store/actionTypes'

const setCmd = data => {
  return {
    type: types.SET_CMD,
    payload: data,
  }
}

export { setCmd }
