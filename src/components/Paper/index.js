import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import classNames from 'classnames'

import { setAside } from 'store/actions/asideAction'

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
          classes && classes.map(el => style[el]),
        )
      }
    >
      {headline && (
        <>
          <div className={style.headline}>
            <h5>{headline}</h5>
            {
              close && (
                <Icon
                  icon={'fa-times'}
                  action={() => dispatch(setAside(null))}
                  alt={'Close'}
                />
              )
            }
            {
              quantity && (
                <div className={style.option}>
                  <Select
                    placeholder={t('rows')}
                    options={[
                      { value: 20, label: '20' },
                      { value: 50, label: '50' },
                      { value: 100, label: '100' },
                    ]}
                    data={quantity}
                    onChange={value =>
                      setQuantity(prevData => ({
                        ...prevData,
                        quantity: value,
                      }))
                    }
                  />
                </div>
              )
            }
          </div>
          <hr className={style.hr} />
        </>
      )}
      <div className={style.body}>{children}</div>
    </div>
  )
}

export default Paper
