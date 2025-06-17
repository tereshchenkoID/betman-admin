import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Select from 'components/Select'
import Icon from 'components/Icon'
import Button from 'components/Button'
import ColorPicker from '../ColorPicker'

import style from '../index.module.scss'

const Update = ({
  isDisabled,
  handlePropsChange,
  handleLoadSkin,
  handleAction,
  skin,
  filter,
  setFilter
}) => {
  const { t } = useTranslation()
  const { settings } = useSelector(state => state.settings)
  const [active, setActive] = useState(false)

  useEffect(() => {
    handleLoadSkin(filter.id)
  }, [filter])

  if (!skin) return

  return (
    <>
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
          icon={'fa-trash'}
          alt={t('remove')}
          classes={['warning', style.remove]}
          action={() => setActive(true)}
          disabled={filter.id === '1'}
        />
      </div>
      {
        skin?.map((el, idx) =>
          <ColorPicker
            key={idx}
            data={el}
            isDisabled={isDisabled || el.visible === '0'}
            onChange={(value) => handlePropsChange(idx, value)}
          />
        )
      }
      {
        active &&
        <div className={style.modal}>
          <div className={style.wrapper}>
            <p>Are you sure than you want to delete skin?</p>
            <div className={style.action}>
              <Button
                type={'button'}
                classes={'primary'}
                placeholder={t('yes')}
                onChange={() => {
                  handleAction('delete')
                  setActive(false)
                }}
              />
              <Button
                type={'button'}
                classes={'warning'}
                placeholder={t('no')}
                onChange={() => {
                  setActive(false)
                }}
              />
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Update
