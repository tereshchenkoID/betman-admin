import { types } from 'store/actionTypes'

const initialState = {
  cashier: {},
}

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CASHIER:
      return {
        ...state,
      }
    case types.GET_CASHIER:
      return {
        ...state,
        cashier: action.payload,
      }
    default:
      return state
  }
}

export default playerReducer
