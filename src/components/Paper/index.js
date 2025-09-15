import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import classNames from 'classnames'

import { service } from 'constant/config'

import { setAside } from 'store/actions/asideAction'
import { convertOptions } from 'helpers/convertOptions'

import Select from 'components/Select'
import Icon from 'components/Icon'

import style from './index.module.scss'

const Paper = ({
  headline,
  children,
  quantity = null,
  classes = null,
  close = null,
  setQuantity,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <div
      className={
        classNames(
          style.block,
          classes && classes.map(el => style[el] || el),
        )
      }
    >
      {
        headline &&
        <>
          <div className={style.headline}>
            <h5>{headline}</h5>
            {
              close &&
              <Icon
                icon={'fa-times'}
                action={() => dispatch(setAside(null))}
                alt={'Close'}
              />
            }
            {
              quantity &&
              <div className={style.option}>
                <Select
                  placeholder={t('rows')}
                  options={convertOptions(service.QUANTITY)}
                  data={quantity}
                  onChange={value => setQuantity(value)}
                />
              </div>
            }
          </div>
          <hr className={style.hr} />
        </>
      }
      <div className={style.body}>{children}</div>
    </div>
  )
}

export default Paper
