import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { modes, service } from 'constant/config'

import { postData } from 'hooks/useRequest'
import { convertOptions } from 'helpers/convertOptions'
import { setToastify } from 'store/actions/toastifyAction'

import Button from 'components/Button'
import ToggleSwitch from 'components/ToggleSwitch'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const DATA = [
  { id: 1, domain: 'example.com', enabled: true },
  { id: 2, domain: 'shop.example.com', enabled: false },
  { id: 3, domain: 'example1.com', enabled: true },
  { id: 4, domain: 'example2.com', enabled: true },
  { id: 5, domain: 'example3.com', enabled: true },
  { id: 6, domain: 'example4.com', enabled: true },
  { id: 7, domain: 'example5.com', enabled: true },
  { id: 8, domain: 'example6.com', enabled: true },
  { id: 9, domain: 'example7.com', enabled: true },
  { id: 10, domain: 'example8.com', enabled: true },
];

const Websites = ({ data, inherit, setUpdate }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState({
    ...data.shop,
    domains: data.shop?.domains ?? DATA,
  })
  const isDisabled = inherit === '1'

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(data.shop)
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
            <div className={style.cell}><strong>ID</strong></div>
            <div className={style.cell}><strong>{t('domain_name')}</strong></div>
            <div className={style.cell}><strong></strong></div>
          </div>
          {filter.domains?.map((domain, idx) => (
            <div className={style.row} key={domain.id}>
              <div className={style.cell}>{domain.id}</div>
              <div className={style.cell}>{domain.domain}</div>
              <div className={style.cell}>
                <ToggleSwitch
                  isOn={domain.enabled}
                  handleToggle={() => {
                    const updatedDomains = [...filter.domains]
                    updatedDomains[idx].enabled = !domain.enabled
                    handlePropsChange('domains', updatedDomains)
                  }}
                  label=""
                />
              </div>
            </div>
          ))}
        </div>
        <div className={style.actions}>
          <Button type={'submit'} classes={'primary'} placeholder={t('save')}/>
        </div>
      </form>
    </>
  )
}

export default Websites
