import style from './index.module.scss'

const Scale = ({ name, value, color }) => {
  return (
    <div>
      <div className={style.title}>
        <p>{name}</p>
        <p>{value}%</p>
      </div>
      <div className={style.scale}>
        <div
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
          className={style.value}
        />
      </div>
    </div>
  )
}

export default Scale
