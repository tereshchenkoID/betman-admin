import React from 'react'
import { useTranslation } from 'react-i18next'

import { REQUEST_TYPE } from 'constant/config'

import { useAuthStore } from 'stores/authStore'
import { useApi } from 'hooks/useApi'
import { buildFormData } from 'helpers/buildFormData'
import { useFilterState } from 'hooks/useFilterState'

import Field from 'components/Field'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Password from 'components/Password'

import style from './index.module.scss'

const Login = ({ setActive }) => {
  const { t } = useTranslation()
  const { auth, setAuth, deleteAuth } = useAuthStore()
  const { request } = useApi()
  const isShift = auth.shift?.status === '1'

  const INITIAL_FILTER = {
    real_balance: isShift ? '' : (auth?.shift?.start_balance || ''),
    password: ''
  }

  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = buildFormData(filter)
    const { data, error } = await request(REQUEST_TYPE.POST, `shifts/${isShift ? 'close' : 'open'}/`, formData)

    if (!error) {
      setAuth(data)

      if (isShift) {
        deleteAuth()
      }
    }
  }

  return (
    <div className={style.block}>
      <Paper
        headline={t(isShift ? 'close_shift' : 'open_shift')}
        classes={['sm']}
      >
        <form className={style.form} onSubmit={handleSubmit}>
          <Field
            type={'number'}
            placeholder={t('balance')}
            data={filter.real_balance}
            onChange={value => handlePropsChange('real_balance', value)}
            isRequired={true}
            isDisabled={!isShift}
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
              placeholder={t(auth.shift?.status === '1' ? 'close' : 'open')}
            />
            <Button
              type={'reset'}
              placeholder={t('cancel')}
              onChange={() => setFilter(INITIAL_FILTER)}
            />
            {
              auth.shift?.status === '1' &&
              <Button
                type={'reset'}
                placeholder={t('back')}
                onChange={() => setActive(true)}
              />
            }
          </div>
        </form>
      </Paper>
    </div>
  )
}

export default Login
