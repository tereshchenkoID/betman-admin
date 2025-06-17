import React from 'react'
import { useTranslation } from 'react-i18next'

import { Doughnut } from 'react-chartjs-2'

import { service } from 'constant/config'

import { hexToRgba } from 'helpers/hexToRgba'
import { convertFixed } from 'helpers/convertFixed'

import Paper from 'components/Paper'

import style from './index.module.scss'

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    title: {
      display: false,
      text: 'title',
    },
  },
}

const GamesReport = ({ data }) => {
  const { t } = useTranslation()
  const dataset = {
    labels: data.games.map(game => game.name),
    datasets: [
      {
        label: false,
        data: data.games.map(game => game.report),
        backgroundColor: data.games.map((_, idx) =>
          hexToRgba(service.COLORS[idx], 0.2),
        ),
        borderColor: data.games.map((_, idx) => service.COLORS[idx]),
        borderWidth: 1,
      },
    ],
  }

  return (
    <Paper headline={t('games_report')}>
      <div className={style.block}>
        <div className={style.chart}>
          <Doughnut options={options} data={dataset} />
        </div>
        <div>
          {data.games.map((el, idx) => (
            <div key={idx} className={style.item}>
              <div className={style.meta}>
                <div
                  style={{
                    backgroundColor: hexToRgba(service.COLORS[idx], 0.2),
                  }}
                  className={style.color}
                />
                <h6>{el.name}</h6>
              </div>
              <div className={style.value}>
                <strong>{convertFixed(el.report)}</strong>{' '}
                {data.settings.currency}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  )
}

export default GamesReport
