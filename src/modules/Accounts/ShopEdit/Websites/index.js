import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import Toggle from "components/Toggle";

import Debug from 'modules/Debug'

import style from './index.module.scss'

const DATA = [
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
];

const Websites = ({ data, inherit, setUpdate }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState({
    ...data.shop,
    domains: data.shop?.domains ?? DATA,
  })

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    // setFilter(initialValue)
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

    postData('accounts/edit/shop/', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
        setUpdate(true)
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
          {filter.domains?.map((domain, idx) => (
            <div className={style.row} key={domain.id}>
              <div className={style.cell}>{domain.id}</div>
              <div className={style.cell}>{domain.domain}</div>

              <div className={style.cell}>
                <Toggle
                  data={domain.pos}
                  onChange={() => {
                    const updated = [...filter.domains]
                    updated[idx].pos = domain.pos === '1' ? '0' : '1';
                    handlePropsChange('domains', updated)
                  }}
                />
              </div>

              <div className={style.cell}>
                <Toggle
                  data={domain.access}
                  onChange={() => {
                    const updated = [...filter.domains]
                    updated[idx].access = domain.access === '1' ? '0' : '1';
                    handlePropsChange('domains', updated)
                  }}
                />
              </div>

              <div className={style.cell}>
                <Toggle
                  data={domain.enabled}
                  onChange={() => {
                    const updated = [...filter.domains]
                    updated[idx].enabled = domain.enabled === '1' ? '0' : '1';
                    handlePropsChange('domains', updated)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={style.actions}>
          <Button type={'submit'} classes={'primary'} placeholder={t('save')}/>
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
