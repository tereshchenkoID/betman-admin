import React from 'react'
import { useTranslation } from 'react-i18next'

import { service } from 'constant/config'

import { hexToRgba } from 'helpers/hexToRgba'

import Paper from 'components/Paper'
import Scale from './Scale'

import style from './index.module.scss'

const SalesCountry = ({ data }) => {
  const { t } = useTranslation()
  return (
    <Paper headline={t('sales_by_country')}>
      <div className={style.block}>
        {data.countries.map((el, idx) => (
          <Scale
            key={idx}
            name={el.name}
            value={el.value}
            color={hexToRgba(service.COLORS[idx], 1)}
          />
        ))}
      </div>
    </Paper>
  )
}

export default SalesCountry
