import { types } from 'store/actionTypes'

const initialState = {
  aside: null,
}

const asideReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ASIDE:
      return {
        ...state,
      }
    case types.SET_ASIDE:
      return {
        ...state,
        aside: action.payload,
      }
    default:
      return state
  }
}

export default asideReducer
