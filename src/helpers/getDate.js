export const getDate = (date, type) => {
  const data = new Date(date)

  const year = data.getFullYear().toString().padStart(4, '0')
  const month = (data.getMonth() + 1).toString().padStart(2, '0')
  const day = data.getDate().toString().padStart(2, '0')
  const hours = data.getHours().toString().padStart(2, '0')
  const minutes = data.getMinutes().toString().padStart(2, '0')
  const seconds = data.getSeconds().toString().padStart(2, '0')

  if (type === 'datetime-local') {
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
  if (type === 'time-local') {
    return `${hours}:${minutes}:${seconds}`
  }
  if (type === 'datetime') {
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
  return `${day}-${month}-${year}`
}
