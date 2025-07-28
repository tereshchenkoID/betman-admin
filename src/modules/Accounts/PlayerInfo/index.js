import React from 'react'
import { useTranslation } from "react-i18next"

import style from './index.module.scss'

const DATA = {
  general: [
    { label: 'id', value: '368643' },
    { label: 'balance', value: '499.10' },
    { label: 'login', value: 'player_1' },
    { label: 'shop', value: 'test_m2' },
  ],
  financial: [
    { label: 'last_deposit', value: '11.05.2025, 16:41:36' },
    { label: 'last_withdraw', value: '—' },
    { label: 'deposit_amount', value: '500.00' },
    { label: 'withdraw_amount', value: '—' },
  ],
  other: [
    { label: 'registered', value: '10.05.2025, 13:14:44' },
    { label: 'last_login', value: '22.06.2025, 21:59:57' },
    { label: 'last_game', value: 'Fishing God' },
    { label: 'favorites_games_in', value: '0' },
    { label: 'last_spin', value: '—' },
    { label: 'last_login', value: '212.178.19.16' },
  ],
  kyc: [
    { label: 'kys_confirmed', value: 'No' },
    { label: 'reason', value: '—' },
    { label: 'updated', value: '—' },
  ],
}

const PlayerInfo = () => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      {
        Object.entries(DATA).map(([section, items]) =>
        <div key={section}>
          {
            section !== 'general' &&
            <h3 className={style.title}>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
          }
          {
            items.map((item, idx) =>
            <div
              key={idx}
              className={style.info}
            >
              <span>{t(item.label)}:</span>
              <span>{item.value}</span>
            </div>
          )}
        </div>
        )}
    </div>
  )
}

export default PlayerInfo
