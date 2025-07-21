import React from 'react'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'

import style from './index.module.scss'

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <Paper headline={t('dashboard')} classes={['sm']}>
        Dashboard
      </Paper>
    </div>
  )
}

export default Dashboard
