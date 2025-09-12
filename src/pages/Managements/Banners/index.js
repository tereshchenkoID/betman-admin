import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Paper from 'components/Paper'

import style from './index.module.scss'

const Banners = () => {
  const { t } = useTranslation()
  const { banner } = useParams()

  // Создать 2 компонента
  // 1 - <Edit /> - для редактирования, добавления
  // 2 - <List /> - для вывода
  //
  // Edit - 4 поля текстовых (заголовок, подзаголовок, категория и екнш для кнопки), отдельно поле для загрузки картинки
  // Изначально загрузка баннера для редактирования и надо вставлять данные в поля формы и загрузки.
  //
  // List - список баннеров с фильтрацией просто заглушка формата нету еще. Фильтрация по дате добавление от и до и категория.
  // Пагинация должна быть. Сортировка пока только id и категории

  return (
    <div className={style.block}>
      <Paper
        headline={banner ? `${t('banner')}: ${banner}`: t('banners')}
        classes={['sm']}
      >
        {
          banner
            ?
              <div>Add / Edit</div>
            :
              <div>List</div>
        }
      </Paper>
    </div>
  )
}

export default Banners
