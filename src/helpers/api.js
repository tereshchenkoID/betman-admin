import { useRequest } from 'hooks/useRequest'

export const getData = async url => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { get } = useRequest(url)

  try {
    return await get()
  } catch (e) {
    console.log(e)
  }
}

export const postData = async (url, data, headers) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { post } = useRequest(url, data, headers)

  try {
    return await post()
  } catch (e) {
    console.log(e)
  }
}
