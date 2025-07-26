import { types } from 'store/actionTypes'

const initialState = {
  withdrawal: {},
}

const withdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_WITHDRAWAL:
      return {
        ...state,
      }
    case types.GET_WITHDRAWAL:
      return {
        ...state,
        withdrawal: action.payload,
      }
    default:
      return state
  }
}

export default withdrawalReducer
