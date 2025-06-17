import { types } from 'store/actionTypes'

const initialState = {
  cmd: null,
}
const cmdReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CMD:
      return {
        ...state,
      }
    case types.SET_CMD:
      return {
        ...state,
        cmd: action.payload,
      }
    default:
      return state
  }
}

export default cmdReducer
