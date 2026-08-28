import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import clsx from 'clsx'

import style from './index.module.scss'

const Pagination = ({
  position,
  pagination,
  handleSubmit
}) => {

  if(!pagination || pagination?.pages === '0') return

  return (
    <div
      className={
        clsx(
          style.block,
          style[position]
        )
      }
    >
      <button
        type={'button'}
        aria-label="Pagination start"
        className={
          clsx(
            style.action,
            pagination.page === '0' && style.disabled,
          )
        }
        onClick={() => handleSubmit(null, 0)}
      >
        <FontAwesomeIcon
          icon="fa-solid fa-angle-double-left"
          className={style.icon}
        />
      </button>
      <button
        type={'button'}
        aria-label="Pagination previous"
        className={
          clsx(
            style.action,
            pagination.page === '0' && style.disabled,
          )
        }
        onClick={() => handleSubmit(null, Number(pagination.page) - 1)}
      >
        <FontAwesomeIcon
          icon="fa-solid fa-angle-left"
          className={style.icon}
        />
      </button>
      <strong className={style.text}>{Number(pagination.page) + 1}</strong>
      <button
        type={'button'}
        aria-label="Pagination next"
        className={
          clsx(
            style.action,
            pagination.page === pagination.pages && style.disabled
          )
        }
        onClick={() => handleSubmit(null, Number(pagination.page) + 1)}
      >
        <FontAwesomeIcon
          icon="fa-solid fa-angle-right"
          className={style.icon}
        />
      </button>
      <button
        type={'button'}
        aria-label="Pagination end"
        className={
          clsx(
            style.action,
            pagination.page === pagination.pages && style.disabled
          )
        }
        onClick={() => handleSubmit(null, Number(pagination.pages))}
      >
        <FontAwesomeIcon
          icon="fa-solid fa-angle-double-right"
          className={style.icon}
        />
      </button>
    </div>
  )
}

export default Pagination
