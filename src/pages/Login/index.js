import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import i18n from 'i18next'

import { NAVIGATION, REQUEST_TYPE } from 'constant/config'

import { setToastify } from 'store/actions/toastifyAction'
import { useApi } from 'hooks/useApi'
import { useAuth } from 'hooks/useAuth'
import { buildFormData } from 'helpers/buildFormData'

import Field from 'components/Field'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Password from 'components/Password'

import style from './index.module.scss'

const INITIAL_FILTER = { username: '', password: '' }

const Login = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { initAuth } = useAuth()
  const { request } = useApi()
  const navigate = useNavigate()

  const [filter, setFilter] = useState(INITIAL_FILTER)

  const handlePropsChange = (fieldName, fieldValue) => {
    setFilter(prevData => ({
      ...prevData,
      [fieldName]: fieldValue,
    }))
  }

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = buildFormData(filter)
    const json = await request(REQUEST_TYPE.POST, 'login/', formData)

    if (json.id) {
      initAuth(json)
      sessionStorage.setItem('authToken', JSON.stringify(json))
      sessionStorage.setItem('language', JSON.stringify(json?.language))
      i18n.changeLanguage(json?.language?.code)
      dispatch(
        setToastify({
          type: 'success',
          text: `${t('successfully_logged')} ${json?.username}!`
        }),
      )
      navigate(NAVIGATION.home.link)
    }
  }

  return (
    <div className={style.block}>
      <Paper
        headline={t(NAVIGATION.login.text)}
        classes={['sm']}
      >
        <form className={style.form} onSubmit={handleSubmit}>
          <Field
            type={'text'}
            placeholder={t('username')}
            data={filter.username}
            onChange={value => handlePropsChange('username', value)}
            isRequired={true}
          />
          <Password
            placeholder={t('password')}
            data={filter.password}
            onChange={value => handlePropsChange('password', value)}
            isRequired={true}
          />
          <div className={style.actions}>
            <Button
              type={'submit'}
              classes={['primary']}
              placeholder={t('login')}
            />
            <Button
              type={'reset'}
              placeholder={t('cancel')}
              onChange={handleResetForm}
            />
          </div>
        </form>
      </Paper>
    </div>
  )
}

export default Login
