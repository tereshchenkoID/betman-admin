import React from 'react'
import { useTranslation } from 'react-i18next'

import style from './index.module.scss'

const PlaceInfo = ({ data }) => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <h2>
        {t('host')}: { data?.host }
      </h2>
      <p>
        {t('username')}: { data?.username }
      </p>
      <p>
        {t('id')}: { data?.player_id }
      </p>
      <p>
        {t('total_balance')}: { data?.balance.total } { data?.currency }
      </p>
      <p>
        {t('real_balance')}: { data?.balance.real } { data?.currency }
      </p>
      <p>
        {t('bonus_balance')}: { data?.balance.bonus } { data?.currency }
      </p>
      <p>
        {t('profit')}: { data?.profit } { data?.currency }
      </p>
      <p>
        {t('rtp')}: { data?.rtp }%
      </p>
      <p>
        {t('currency')}: { data?.currency }
      </p>
      <p>
        {t('agent_id')}: { data?.agent_id }
      </p>
      <p>
        {t('shop_id')}: { data?.shop_id }
      </p>
      <p>
        {t('cashier_id')}: { data?.cashier_id }
      </p>
    </div>
  )
}

export default PlaceInfo
