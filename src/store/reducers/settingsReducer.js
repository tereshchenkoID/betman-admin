import { types } from 'store/actionTypes'

const initialState = {
  settings: {},
}

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_SETTINGS:
      return {
        ...state,
      }
    case types.SET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      }
    default:
      return state
  }
}

export default settingsReducer
