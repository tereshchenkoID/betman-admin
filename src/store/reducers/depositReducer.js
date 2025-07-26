import { types } from 'store/actionTypes'

const initialState = {
  deposit: {},
}

const depositReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DEPOSIT:
      return {
        ...state,
      }
    case types.GET_DEPOSIT:
      return {
        ...state,
        deposit: action.payload,
      }
    default:
      return state
  }
}

export default depositReducer
