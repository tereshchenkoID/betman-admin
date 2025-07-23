import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import classNames from 'classnames'

import style from './index.module.scss'

const Pagination = ({
  position,
  pagination,
  handleSubmit
}) => {

  const handleClick = (page) => {
    handleSubmit(null, page)
  }

  return (
    <div
      className={
        classNames(
          style.block,
          style[position]
        )
      }
    >
      <button
        type={'button'}
        aria-label="Pagination start"
        className={
          classNames(
            style.action,
            pagination.page === '0' && style.disabled,
          )
        }
        onClick={() => handleClick(0)}
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
          classNames(
            style.action,
            pagination.page === '0' && style.disabled,
          )
        }
        onClick={() => handleClick(Number(pagination.page) - 1)}
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
          classNames(
            style.action,
            pagination.page === pagination.pages && style.disabled
          )
        }
        onClick={() => handleClick(Number(pagination.page) + 1)}
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
          classNames(
            style.action,
            pagination.page === pagination.pages && style.disabled
          )
        }
        onClick={() => handleClick(Number(pagination.pages) - 1)}
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
