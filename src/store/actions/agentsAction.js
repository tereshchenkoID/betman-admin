import { getData } from 'hooks/useRequest'
import { types } from 'store/actionTypes'

export const setAgents = () => async dispatch => {
  try {
    const data = await getData('tree/')

    dispatch({
      type: types.SET_AGENTS,
      payload: data,
    })

    return data
  } catch (e) {
    console.log(e)
    return null
  }
}

export const updateAgents = data => async dispatch => {
  dispatch({
    type: types.SET_AGENTS,
    payload: data,
  })
}
