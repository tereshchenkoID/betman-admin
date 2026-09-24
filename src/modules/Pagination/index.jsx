import clsx from 'clsx'
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react'

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
        <ChevronsLeft size="20" />
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
        <ChevronLeft size="20" />
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
        <ChevronRight size="20" />
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
        <ChevronsRight size="20" />
      </button>
    </div>
  )
}

export default Pagination
