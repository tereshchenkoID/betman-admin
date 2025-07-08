import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Select from 'components/Select'
import Icon from 'components/Icon'

import style from '../index.module.scss'

const Activate = ({
  isDisabled,
  filter,
  setFilter,
  handleAction
}) => {
  const { t } = useTranslation()
  const { settings } = useSelector(state => state.settings)

  return (
    <div className={style.head}>
      <Select
        placeholder={t('skin')}
        options={
          settings.skins.map(item => ({
            value: item.id,
            label: item.name,
          }))
        }
        data={filter.id}
        onChange={(value) => setFilter(settings.skins.find(item => item.id === value))}
        classes={[isDisabled && 'disabled']}
      />
      <Icon
        icon={'fa-save'}
        alt={t('remove')}
        classes={['primary', style.remove]}
        action={() => handleAction('activate')}
      />
    </div>
  )
}

export default Activate
