import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NAVIGATION } from 'constant/config'

import Button from 'components/Button'
import Reference from "components/Reference";
import {getDate} from "helpers/getDate";

import style from './index.module.scss'

const List = ({ onEdit, onDelete }) => {
  const { t } = useTranslation()

  const [banners, setBanners] = useState([
    {
      id: 1,
      image: 'https://api.netgames.club/img/banners/1.jpg',
      title: 'Banner 1',
      subtitle: 'Subtitle 1',
      category: 'A',
      startDateMs: 1744873320000
    },
    {
      id: 2,
      image: 'https://api.netgames.club/img/banners/2.jpg',
      title: 'Banner 2',
      subtitle: 'Subtitle 2',
      category: 'B',
      startDateMs: 1744873320000
    },
  ])

  return (
    <div className={style.block}>
      <div className={style.list}>
        <div className={style.item}>
          <div>
            {t('id')}
          </div>
          <div>
            {t('image')}
          </div>
          <div>
            {t('title')}
          </div>
          <div>
            {t('subtitle')}
          </div>
          <div>
            {t('category')}
          </div>
          <div>
            {t('start_date')}
          </div>
        </div>
        {banners.map(b => (
          <div key={b.id} className={style.item}>
            <div>
              {b.id}
            </div>
            <div>
              {b.image && <img src={b.image} alt={b.title} width={60}/>}
            </div>
            <div>
              {b.title}
            </div>
            <div>
              {b.subtitle}
            </div>
            <div>
              {b.category}
            </div>
            <div>
              {getDate(b.startDateMs)}
            </div>
            <div className={style.actions}>
              <Reference
                to={`${NAVIGATION.managements.banners.link}/${b.id}}`}
                classes={['outline']}
                placeholder={t('edit')}
              />
              <Button
                classes={['secondary']}
                placeholder={t('delete')}
                onClick={() => alert('DELETE')}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List;
