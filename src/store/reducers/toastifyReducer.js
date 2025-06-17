import { types } from 'store/actionTypes'

const initialState = {
  toastify: null,
}

const toastifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_TOASTIFY:
      return {
        ...state,
      }
    case types.SET_TOASTIFY:
      return {
        ...state,
        toastify: action.payload,
      }
    default:
      return state
  }
}

export default toastifyReducer
