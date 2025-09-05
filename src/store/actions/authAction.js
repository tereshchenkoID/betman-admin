import { useRequest } from 'hooks/useRequest'

import { types } from 'store/actionTypes'

export const setAuth = value => async dispatch => {
  if (value) {
    dispatch({
      type: types.SET_AUTH,
      payload: value,
    })

    return value
  } else {
    const { get } = useRequest('authSession/')

    try {
      const data = await get()
      const language = JSON.parse(sessionStorage.getItem('language'))

      if(language) {
        data.language = language
      }

      dispatch({
        type: types.SET_AUTH,
        payload: data,
      })

      return data
    } catch (e) {
      console.log(e)
    }
  }
}
