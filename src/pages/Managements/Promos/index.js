import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'

import style from './index.module.scss'
import Edit from "./Edit";
import List from "./List";

const Promos = () => {
  const { t } = useTranslation()
  const { promo } = useParams()

  const handleSubmit = (formData) => {
    console.log('Submit banner', formData)
  }

  return (
    <div className={style.block}>
      <Paper
        headline={promo ? `${t('promo')}: ${promo}`: t('promos')}
        classes={['sm']}
      >
        {
          promo
            ?
            <Edit bannerId={promo} onSubmit={handleSubmit} />
            :
            <List />
        }
      </Paper>
    </div>
  )
}

export default Promos
