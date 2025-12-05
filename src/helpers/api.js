import axios from 'axios'

import { hostname } from "helpers/hostname"

export const request = async (method, url, data = null, headers = {}) => {
  try {
    const res = await axios({
      baseURL: `${hostname()}/${url}`,
      method,
      data,
      headers,
      withCredentials: true,
    })
    return res.data
  } catch (e) {
    console.log(e)
    return e.response
  }
}

export const getData = (url, headers) =>
  request('get', url, null, headers)

export const postData = (url, data, headers) =>
  request('post', url, data, headers)
