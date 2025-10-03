import { getDate } from './getDate'

const getTimeframeFrom = (time, type) => {
  const today = new Date()
  let result

  if (time === 0) {
    today.setHours(today.getHours(), 0, 0, 0)
    result = today
  } else if (time === 1) {
    result = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  } else if (time === 2) {
    const startOfWeek = new Date(today)
    const dayOfWeek = today.getDay()
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)

    result = startOfWeek
  } else if (time === 3) {
    result = new Date(today.getFullYear(), today.getMonth(), 1)
  } else if (time === 4) {
    result = today.setHours(today.getHours() - 1, 0, 0, 0)
  } else if (time === 5) {
    today.setDate(today.getDate() - 1)
    today.setHours(0, 0, 0, 0)
    result = today
  } else if (time === 6) {
    const lastWeekStart = new Date(today)
    lastWeekStart.setDate(today.getDate() - 7 - today.getDay() + 1)
    lastWeekStart.setHours(0, 0, 0, 0)

    result = lastWeekStart
  } else if (time === 7) {
    result = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0)
  }

  return getDate(result, type)
}

const getTimeframeTo = (time, type) => {
  const today = new Date()
  let result

  if (time === 0 || time === 1 || time === 2 || time === 3) {
    result = today
  } else if (time === 4) {
    result = today.setHours(today.getHours(), 0, 0, 0)
  } else if (time === 5) {
    today.setDate(today.getDate() - 1)
    today.setHours(23, 59, 59, 999)
    result = today
  } else if (time === 6) {
    const lastWeekEnd = new Date(today)
    lastWeekEnd.setDate(today.getDate() - today.getDay())
    lastWeekEnd.setHours(23, 59, 59, 999)
    result = lastWeekEnd
  } else if (time === 7) {
    const last = new Date(today.getFullYear(), today.getMonth(), 0)
    last.setHours(23, 59, 59, 999)
    result = last
  }

  return getDate(result, type)
}

export { getTimeframeFrom, getTimeframeTo }
