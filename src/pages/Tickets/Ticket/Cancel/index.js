import React from 'react'
import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import Button from 'components/Button'
import Icon from 'components/Icon'

import style from './index.module.scss'

const Cancel = ({ data, action, setCancel, alt }) => {
  const { t } = useTranslation()

  return (
    <>
      <Icon icon={'fa-times'} action={setCancel} alt={t(alt || 'add')} />

      <div className={classNames(style.modal, data && style.active)}>
        <div className={style.wrapper}>
          <div className={style.body}>
            <p>{t('confirm_cancel_stake')}</p>
          </div>
          <div className={style.actions}>
            <Button
              type={'button'}
              classes={'primary'}
              placeholder={t('yes')}
              onChange={action}
            />
            <Button
              type={'button'}
              placeholder={t('no')}
              onChange={setCancel}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Cancel
