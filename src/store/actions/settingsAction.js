import { getData } from 'hooks/useRequest'
import { types } from 'store/actionTypes'

export const setSettings = () => async dispatch => {
  try {
    const data = await getData('settings/')

    dispatch({
      type: types.SET_SETTINGS,
      payload: data,
    })

    return data
  } catch (e) {
    console.log(e)
    return null
  }
}
