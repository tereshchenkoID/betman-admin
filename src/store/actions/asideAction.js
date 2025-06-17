import { types } from 'store/actionTypes'

export const setAside = data => async dispatch => {
  dispatch({
    type: types.SET_ASIDE,
    payload: data,
  })
}
