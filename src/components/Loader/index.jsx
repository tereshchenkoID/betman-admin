import clsx from 'clsx'

import style from './index.module.scss'

const Loader = ({ type = 'default' }) => {
  return (
    <div
      className={
        clsx(
          style.block,
          style[type]
        )
      }
    >
      <div className={style.item} />
    </div>
  )
}

export default Loader
