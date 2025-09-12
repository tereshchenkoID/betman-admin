import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'
import Edit from "./Edit";
import List from "./List";

import style from './index.module.scss'

const Banners = () => {
  const { t } = useTranslation()
  const { banner } = useParams()

  const handleSubmit = (formData) => {
    console.log('Submit banner', formData)
  }

  return (
    <div className={style.block}>
      <Paper
        headline={banner ? `${t('banner')}: ${banner}`: t('banners')}
        classes={['sm']}
      >
        {
          banner
            ?
            <Edit bannerId={banner} onSubmit={handleSubmit} />
            :
            <List />
        }
      </Paper>
    </div>
  )
}

export default Banners
