import React from 'react'

import style from './index.module.scss'

const PlaceInfo = ({ data }) => {
  return (
    <div className={style.block}>
      <h2>
        Host: { data?.host }
      </h2>
      <p>
        Username: { data?.username }
      </p>
      <p>
        Player ID: { data?.player_id }
      </p>
      <p>
        Total balance: { data?.balance.total } { data?.currency }
      </p>
      <p>
        Real balance: { data?.balance.real } { data?.currency }
      </p>
      <p>
        Bonus balance: { data?.balance.bonus } { data?.currency }
      </p>
      <p>
        Profit: { data?.profit } { data?.currency }
      </p>
      <p>
        rtp: { data?.rtp }%
      </p>
      <p>
        Currency: { data?.currency }
      </p>
      <p>
        Agent ID: { data?.agent_id }
      </p>
      <p>
        Shop ID: { data?.shop_id }
      </p>
      <p>
        Cashier ID: { data?.cashier_id }
      </p>
    </div>
  )
}

export default PlaceInfo
