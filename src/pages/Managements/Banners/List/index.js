import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'

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
    },
    {
      id: 2,
      image: 'https://api.netgames.club/img/banners/2.jpg',
      title: 'Banner 2',
      subtitle: 'Subtitle 2',
      category: 'B',
    },
  ])

  return (
    <div className={style.block}>
      <div className={style.list}>
        {banners.map(b => (
          <div key={b.id} className={style.item}>
            <div>
              {b.id}
            </div>
            <div>
              {b.image && <img src={b.image} alt={b.title} width={60} />}
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
            <div className={style.actions}>
              <Button
                classes={['primary']}
                placeholder={t('edit')}
                onClick={() => alert('EDIT')}
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
