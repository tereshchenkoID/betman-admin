import Button from 'components/Button'
import Sprite from 'components/Sprite'

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
      <Sprite name="chevron-left" size="20" />
    </Button>
  )
}

export default Back
