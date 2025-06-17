import axios from 'axios'
import { getHostName } from 'helpers/getHostName'

const handleUnauthorized = (response) => {
  if (response?.data?.code === '4') {
    console.log(response.data)
    sessionStorage.clear()
    window.location = '/'
    return -1
  }
  return response.data
}

const server = axios.create({
  baseURL: getHostName(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getData = async (url) => {
  try {
    const response = await server.get(url)
    return handleUnauthorized(response)
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const postData = async (url, data) => {
  try {
    const response = await server.post(url, data)
    return handleUnauthorized(response)
  } catch (e) {
    return { error: true, message: e.message }
  }
}
