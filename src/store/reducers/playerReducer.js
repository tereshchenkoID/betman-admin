import { types } from 'store/actionTypes'

const initialState = {
  player: {},
}

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PLAYER:
      return {
        ...state,
      }
    case types.GET_PLAYER:
      return {
        ...state,
        player: action.payload,
      }
    default:
      return state
  }
}

export default playerReducer
