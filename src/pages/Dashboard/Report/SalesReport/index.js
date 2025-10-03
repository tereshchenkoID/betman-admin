import React from 'react'
import { useTranslation } from 'react-i18next'
import { Line } from 'react-chartjs-2'

import { service } from 'constant/config'

import { fixed } from 'helpers/fixed'
import { hexToRgba } from 'helpers/hexToRgba'

import Paper from 'components/Paper'

import style from './index.module.scss'

const OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
}

const SalesReport = ({ data }) => {
  const { t } = useTranslation()
  const totalValue1 = data?.sales?.reduce(
    (acc, item) => acc + parseInt(item.value_1, 10),
    0,
  )
  const totalValue2 = data?.sales?.reduce(
    (acc, item) => acc + parseInt(item.value_2, 10),
    0,
  )

  const DATASET = {
    labels: data?.sales?.map(sale => sale.name),
    datasets: [
      {
        label: false,
        data: data?.sales?.map(sale => sale.value_1),
        borderColor: hexToRgba(service.COLORS[0], 0.2),
        backgroundColor: hexToRgba(service.COLORS[0], 0.5),
      },
      {
        label: false,
        data: data?.sales?.map(sale => sale.value_2),
        borderColor: hexToRgba(service.COLORS[1], 0.2),
        backgroundColor: hexToRgba(service.COLORS[1], 0.5),
      },
    ],
  }

  return (
    <Paper headline={t('sales_report')}>
      <div className={style.block}>
        <div className={style.header}>
          <div className={style.item}>
            <div
              style={{
                borderColor: hexToRgba(service.COLORS[0], 0.2),
                backgroundColor: hexToRgba(service.COLORS[0], 0.5),
              }}
              className={style.label}
            />
            <div className={style.meta}>
              <h5>{fixed(totalValue1)}</h5>
              <p>{data?.settings?.currency}</p>
            </div>
            <div />
            <p>{t('total_stakes')}</p>
          </div>
          <div className={style.item}>
            <div
              style={{
                borderColor: hexToRgba(service.COLORS[1], 0.2),
                backgroundColor: hexToRgba(service.COLORS[1], 0.5),
              }}
              className={style.label}
            />
            <div className={style.meta}>
              <h5>{fixed(totalValue2)}</h5>
              <p>{data?.settings?.currency}</p>
            </div>
            <div />
            <p>{t('total_profit')}</p>
          </div>
        </div>
        <div className={style.chart}>
          <Line options={OPTIONS} data={DATASET} />
        </div>
      </div>
    </Paper>
  )
}

export default SalesReport
