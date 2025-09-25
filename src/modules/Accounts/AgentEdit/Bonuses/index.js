import React from 'react'
import { useTranslation } from 'react-i18next'

import Toggle from 'components/Toggle'

import style from './index.module.scss'

const Bonuses = ({ filter, setFilter }) => {
  const { t } = useTranslation()

  const handlePropsChange = (idx, key, value) => {
    setFilter(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, [key]: value } : item
      )
    )
  }

  return (
    <div className={style.block}>
      <div className={style.row}>
        <div className={style.cell}>{t('id')}</div>
        <div className={style.cell}>{t('title')}</div>
        <div className={style.cell}></div>
      </div>
      {
        filter?.map((el, idx) =>
          <div
            className={style.row}
            key={el.id}
          >
            <div className={style.cell}>{el.id}</div>
            <div className={style.cell}>{el.title}</div>
            <div className={style.cell}>
              <Toggle
                data={el.enabled}
                onChange={() => handlePropsChange(idx, 'enabled', el.enabled === '1' ? '0' : '1')}
              />
            </div>
          </div>
        )}
    </div>
  )
}

export default Bonuses
