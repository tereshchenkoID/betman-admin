export const convertOptions = (data, t = () => {}) => {
  return Object.entries(data).map(([key, value]) => {
    return { value: Number(key), label: t(value) }
  })
}
