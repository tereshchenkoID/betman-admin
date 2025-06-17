import { types } from 'store/actionTypes'

export const setToastify = data => async dispatch => {
  dispatch({
    type: types.SET_TOASTIFY,
    payload: data,
  })
}
