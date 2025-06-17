export const convertOptions = data => {
  return Object.entries(data).map(([key, value]) => {
    return { value: Number(key), label: value }
  })
}
