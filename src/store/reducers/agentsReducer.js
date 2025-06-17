import { types } from 'store/actionTypes'

const initialState = {
  agents: {},
}

const agentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_AGENTS:
      return {
        ...state,
      }
    case types.SET_AGENTS:
      return {
        ...state,
        agents: action.payload,
      }
    default:
      return state
  }
}

export default agentsReducer
