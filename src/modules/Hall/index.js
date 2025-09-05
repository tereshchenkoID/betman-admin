import React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from 'components/Button'

import style from './index.module.scss'

const Hall = () => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <div className={style.place}>
        <FontAwesomeIcon
          icon={`fa-solid fa-computer`}
          className={style.icon}
        />
        <div className={style.content}>
          <p>Name: Computer 1</p>
          <p>Balance: 112124</p>
          <div className={style.actions}>
            <Button
              classes={'secondary'}
              placeholder={t('login')}
            />
            <Button
              classes={'primary'}
              placeholder={t('alarm')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hall
