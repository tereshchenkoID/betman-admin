export const getHostName = (type = 'PROD') => {
  const config = JSON.parse(localStorage.getItem('config'))
  return config?.[type] || null
}
