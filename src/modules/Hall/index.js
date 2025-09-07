import React from 'react'

import Place from './Place'

import style from './index.module.scss'

const Hall = ({ data }) => {
  return (
    <div className={style.block}>
      {
        data.map((item, index) =>
          <Place
            key={index}
            info={item}
          />
        )
      }
    </div>
  )
}

export default Hall
