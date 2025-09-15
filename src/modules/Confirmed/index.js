import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'

import style from './index.module.scss'

const Confirmed = ({ data }) => {
  const { t } = useTranslation()

  return (
    <div className={style.block}>
      <div className={style.actions}>
        <Button
          type={'button'}
          placeholder={t('no')}
          onChange={() => data.action(0)}
        />
        <Button
          type={'submit'}
          classes={['primary']}
          placeholder={t('yes')}
          onChange={() => data.action(1)}
        />
      </div>
    </div>
  )
}

export default Confirmed
