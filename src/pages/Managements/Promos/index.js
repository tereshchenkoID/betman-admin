import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'

import style from './index.module.scss'
import List from "./List";

const Promos = () => {
  const { t } = useTranslation()
  const { promo } = useParams()

  // Создать 2 компонента
  // 1 - <Edit /> - для редактирования, добавления

  // Edit - плагин для редактирования текста, отдельно форма для загрузки изображений сверху и 1 кнопка сохранить после нажатия уходит изображение и текст.
  // Изначально загрузка промки для редактирования и надо вставлять данные в поля формы и загрузки. Отдельно поле для категории

  return (
    <div className={style.block}>
      <Paper
        headline={promo ? `${t('promo')}: ${promo}`: t('promos')}
        classes={['sm']}
      >
        {
          promo
            ?
              <div>Add / Edit</div>
            :
            <List />
        }
      </Paper>
    </div>
  )
}

export default Promos
