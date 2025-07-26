import React from 'react'

import style from './index.module.scss'

const DATA = {
  general: [
    { label: 'ID', value: '368643' },
    { label: 'Balance', value: '499.10' },
    { label: 'Login', value: 'player_1' },
    { label: 'Shop', value: 'test_m2' },
  ],
  financial: [
    { label: 'Last deposit at', value: '11.05.2025, 16:41:36' },
    { label: 'Last withdraw at', value: '—' },
    { label: 'Deposit amount', value: '500.00' },
    { label: 'Withdraw amount', value: '—' },
  ],
  other: [
    { label: 'Registered at', value: '10.05.2025, 13:14:44' },
    { label: 'Last login at', value: '22.06.2025, 21:59:57' },
    { label: 'Last game', value: 'Fishing God' },
    { label: 'Games in favorites', value: '0' },
    { label: 'Registered by', value: '—' },
    { label: 'Last spin at', value: '—' },
    { label: 'Last login IP', value: '212.178.19.16' },
  ],
  kyc: [
    { label: 'KYC Confirmed', value: 'No' },
    { label: 'Reason', value: '—' },
    { label: 'Updated at', value: '—' },
  ],
}

const PlayerInfo = () => {
  return (
    <div className={style.block}>
      {Object.entries(DATA).map(([section, items]) => (
        <div key={section}>
          {section !== 'general' && <h3 className={style.title}>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>}
          {items.map((item, idx) => (
            <div key={idx} className={style.info}>
              <span>{item.label}:</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default PlayerInfo
