import { useEffect, useState } from 'react'

const ImagePreview = ({ image, alt, ...props }) => {
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null)
      return
    }

    if (typeof image === 'string') {
      setPreviewUrl(image)
    } else if (image instanceof Blob) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)

      return () => URL.revokeObjectURL(url)
    }
  }, [image])

  if (!previewUrl) return null

  return (
    <img
      src={previewUrl}
      alt={alt}
      {...props}
    />
  )
}

export default ImagePreview
