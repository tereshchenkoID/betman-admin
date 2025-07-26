import { types } from 'store/actionTypes'

const initialState = {
  shop: {},
}

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_SHOP:
      return {
        ...state,
      }
    case types.GET_SHOP:
      return {
        ...state,
        shop: action.payload,
      }
    default:
      return state
  }
}

export default shopReducer
