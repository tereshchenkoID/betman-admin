import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'

import style from './index.module.scss'

const Promos = () => {
  const { t } = useTranslation()
  const { promo } = useParams()

  // Создать 2 компонента
  // 1 - <Edit /> - для редактирования, добавления
  // 2 - <List /> - для вывода
  //
  // Edit - плагин для редактирования текста, отдельно форма для загрузки изображений сверху и 1 кнопка сохранить после нажатия уходит изображение и текст.
  // Изначально загрузка промки для редактирования и надо вставлять данные в поля формы и загрузки. Отдельно поле для категории
  //
  // List - список промок с фильтрацией просто заглушка формата нету еще. Фильтрация по дате добавление от и до и категория.
  // Пагинация должна быть. Сортировка пока только id и категории

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
              <div>List</div>
        }
      </Paper>
    </div>
  )
}

export default Promos
