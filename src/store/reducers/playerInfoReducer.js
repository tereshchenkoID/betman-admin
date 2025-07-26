import { types } from 'store/actionTypes'

const initialState = {
  playerInfo: {},
}

const playerInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PLAYER_INFO:
      return {
        ...state,
      }
    case types.GET_PLAYER_INFO:
      return {
        ...state,
        playerInfo: action.payload,
      }
    default:
      return state
  }
}

export default playerInfoReducer
