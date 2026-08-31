import style from './index.module.scss'

const Inner = ({ data }) => {
  return (
    <div
      className={style.block}
      dangerouslySetInnerHTML={{ __html: data }}
    />
  )
}

export default Inner
