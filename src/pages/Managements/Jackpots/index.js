import React from 'react'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'

import style from './index.module.scss'

const Jackpots = () => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <Paper
        headline={t('jackpots')}
        classes={['sm']}
      >
        <p>1</p>
      </Paper>
    </div>
  )
}

export default Jackpots
