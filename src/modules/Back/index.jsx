import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
      <FontAwesomeIcon
        icon="fa-solid fa-angle-left"
        className={style.icon}
      />
    </Button>
  )
}

export default Back
