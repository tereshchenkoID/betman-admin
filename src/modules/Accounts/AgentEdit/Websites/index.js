import React from 'react'
import { useTranslation } from 'react-i18next'

import Toggle from 'components/Toggle'
import Field from 'components/Field'
import Icon from 'components/Icon'

import style from './index.module.scss'

const Websites = ({ filter, setFilter }) => {
  const { t } = useTranslation()

  const handlePropsChange = (idx, key, value) => {
    setFilter(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, [key]: value } : item
      )
    )
  }

  const handleAdd = () => {
    setFilter(prev => [
      ...prev,
      {
        id: prev.reduce((max, el) => Math.max(max, el.id), 0) + 1,
        domain: '',
        enabled: '0'
      }
    ])
  }

  const handleRemove = (id) => {
    setFilter(prev => prev.filter((_, i) => i !== id))
  }

  return (
    <div className={style.block}>
      <div className={style.row}>
        <div className={style.cell}>{t('id')}</div>
        <div className={style.cell}>{t('domain')}</div>
        <div className={style.cell}></div>
      </div>
      {
        filter?.map((el, idx) =>
          <div
            className={style.row}
            key={el.id}
          >
            <div className={style.cell}>{el.id}</div>
            <div className={style.cell}>
              <Field
                type={'text'}
                classes={['sm']}
                data={el.domain}
                onChange={(value) => handlePropsChange(idx, 'domain', value)}
                isRequired={true}
              />
            </div>
            <div className={style.cell}>
              <Toggle
                data={el.enabled}
                onChange={() => handlePropsChange(idx, 'enabled', el.enabled === '1' ? '0' : '1')}
              />
            </div>
            <div className={style.cell}>
              <Icon
                icon="fa-trash"
                alt="delete"
                action={() => handleRemove(idx)}
              />
            </div>
          </div>
        )}
      <div className={style.row}>
        <div
          className={style.cell}
          style={{
            gridArea: '4 / 4'
          }}
        >
          <Icon
            icon="fa-add"
            alt="add"
            action={() => handleAdd()}
          />
        </div>
      </div>
    </div>
  )
}

export default Websites
