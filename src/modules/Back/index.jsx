import { ChevronLeft } from 'lucide-react'

import Button from 'components/Button'

import style from './index.module.scss'

const Back = ({
  url = null,
  classes = null
}) => {

  const handleBack = () => {
    if (url) {
      window.location.href = url
    } else {
      window.history.back()
    }
  }

  return (
    <Button
      onChange={handleBack}
      classes={['secondary', 'square', classes, style.button]}
      placeholder="Back"
    >
      <ChevronLeft size="20" />
    </Button>
  )
}

export default Back
