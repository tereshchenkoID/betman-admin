import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'helpers/api'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Toggle from 'components/Toggle'

import Debug from 'modules/Debug'

import style from './index.module.scss'

const Websites = ({ data}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const initialValue = [
    { id: 1, domain: 'example.com', pos: '0', access: '1', enabled: '1'},
    { id: 2, domain: 'shop.example.com', pos: '0', access: '1', enabled: '1' },
    { id: 3, domain: 'example1.com', pos: '0', access: '1', enabled: '1'},
    { id: 4, domain: 'example2.com', pos: '0', access: '1', enabled: '1'},
    { id: 5, domain: 'example3.com', pos: '0', access: '1', enabled: '1'},
    { id: 6, domain: 'example4.com', pos: '0', access: '1', enabled: '1'},
    { id: 7, domain: 'example5.com', pos: '0', access: '1', enabled: '1'},
    { id: 8, domain: 'example6.com', pos: '0', access: '1', enabled: '1'},
    { id: 9, domain: 'example7.com', pos: '0', access: '1', enabled: '1'},
    { id: 10, domain: 'example8.com', pos: '0', access: '1', enabled: '1'},
  ]

  const [filter, setFilter] = useState(initialValue)

  const handleResetForm = () => {
    setFilter(initialValue)
  }

  const handlePropsChange = (idx, key) => {
    const updated = [...filter]
    updated[idx] = {
      ...updated[idx],
      [key]: updated[idx][key] === '1' ? '0' : '1',
    }
    setFilter(updated)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)

    Object.entries(filter).map(([key, value]) => {
      formData.append(key, value)
      return true
    })

    postData('website', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
      } else {
        dispatch(
          setToastify({
            type: 'error',
            text: json.error_message,
          }),
        )
      }
    })
  }

  return (
    <>
      <Debug data={filter} />
      <form className={style.block} onSubmit={handleSubmit}>
        <div className={style.table}>
          <div className={style.row}>
            <div className={style.cell}>ID</div>
            <div className={style.cell}>{t('domain_name')}</div>
            <div className={style.cell}>{t('POS')}</div>
            <div className={style.cell}>{t('has_access')}</div>
            <div className={style.cell}>{t('enabled')}</div>
          </div>
          {
            filter.map((el, idx) =>
            <div
              className={style.row}
              key={el.id}
            >
              <div className={style.cell}>{el.id}</div>
              <div className={style.cell}>{el.domain}</div>
              <div className={style.cell}>
                <Toggle
                  data={el.pos}
                  onChange={() => handlePropsChange(idx, 'pos')}
                />
              </div>
              <div className={style.cell}>
                <Toggle
                  data={el.access}
                  onChange={() => handlePropsChange(idx, 'access')}
                />
              </div>
              <div className={style.cell}>
                <Toggle
                  data={el.enabled}
                  onChange={() => handlePropsChange(idx, 'enabled')}
                />
              </div>
            </div>
          )}
        </div>
        <div className={style.actions}>
          <Button
            type={'submit'}
            classes={'primary'}
            placeholder={t('save')}
          />
          <Button
            type={'reset'}
            placeholder={t('cancel')}
            onChange={handleResetForm}
          />
        </div>
      </form>
    </>
  )
}

export default Websites
