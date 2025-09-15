export const buildFormData = (obj) => {
  const formData = new FormData()
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object" && !(value instanceof Blob)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
    }
  })
  return formData
}
