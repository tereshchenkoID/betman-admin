import React from 'react'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'

import style from './index.module.scss'

const Bonuses = () => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <Paper
        headline={t('bonuses')}
        classes={['sm']}
      >
        <p>1</p>
      </Paper>
    </div>
  )
}

export default Bonuses
