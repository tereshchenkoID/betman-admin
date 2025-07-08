import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { postData } from 'hooks/useRequest'
import { setToastify } from 'store/actions/toastifyAction'
import { setAgents } from 'store/actions/agentsAction'

import File from 'components/File'
import Label from 'components/Label'
import Button from 'components/Button'
import Debug from 'modules/Debug'

import style from './index.module.scss'

const Logo = ({ data, inherit, setUpdate }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState(data.logo)
  const isDisabled = inherit === '1'

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(data.logo)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('inherit', inherit)

    Object.entries(filter).map(([key, value]) => {
      if(typeof value === 'object') {
        formData.append(key, value)
      }
      return true
    })

    postData('accounts/edit/logo/', formData).then(json => {
      if (json.code === '0') {
        dispatch(
          setToastify({
            type: 'success',
            text: json.message,
          }),
        )
        setUpdate(true)
        dispatch(setAgents())
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
        <div>
          <Label placeholder={t('logo')} />
          <File
            data={filter.main}
            onChange={value => handlePropsChange('main', value)}
            classes={[isDisabled && 'disabled']}
          />
        </div>
        <div>
          <Label placeholder={t('print_logo')} />
          <File
            data={filter.print}
            onChange={value => handlePropsChange('print', value)}
            classes={[isDisabled && 'disabled']}
          />
        </div>
        <div className={style.actions}>
          <Button type={'submit'} classes={'primary'} placeholder={t('save')} />
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

export default Logo
