import React from 'react'
import { useTranslation } from 'react-i18next'

import Toggle from 'components/Toggle'
import Field from 'components/Field'
import Icon from 'components/Icon'

import style from './index.module.scss'

const IpList = ({ filter, setFilter }) => {
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
        id: null,
        ip: '',
        enabled: '0'
      }
    ])
  }

  const handleRemove = (idx) => {
    setFilter(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className={style.block}>
      <div className={style.row}>
        <div className={style.cell}>{t('ip_list')}</div>
      </div>
      {
        filter?.map((el, idx) =>
          <div
            key={idx}
            className={style.row}
          >
            <div className={style.cell}>{el?.id}</div>
            <div className={style.cell}>
              <Field
                type={'text'}
                classes={['sm']}
                data={el.ip}
                onChange={(value) => handlePropsChange(idx, 'ip', value)}
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
                classes={['error']}
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
            classes={['success']}
            icon="fa-add"
            alt="add"
            action={() => handleAdd()}
          />
        </div>
      </div>
    </div>
  )
}

export default IpList
