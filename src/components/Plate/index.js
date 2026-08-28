import clsx from 'clsx'

import style from './index.module.scss'

const Plate = ({ data, type = 'error' }) => {

  return (
    <p
      className={
        clsx(
          style.block,
          style[type]
        )
      }
    >
      {data}
    </p>
  )
}

export default Plate
