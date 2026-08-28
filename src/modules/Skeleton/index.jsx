import style from './index.module.scss'

const Skeleton = ({ styles, counts }) => {
  return (
    <div className={style.block}>
      {
        Array.from({ length: counts }).map((_, idx) => (
          <div
            key={idx}
            style={styles}
            className={style.item}
          />
        ))
      }
    </div>
  )
}

export default Skeleton
