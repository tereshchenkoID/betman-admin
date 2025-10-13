import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { REQUEST_TYPE } from 'constant/config'

import { useApi } from 'hooks/useApi'
import { useAuth } from 'hooks/useAuth'
import { buildFormData } from 'helpers/buildFormData'
import { useFilterState } from 'hooks/useFilterState'
import { setAuth } from 'store/actions/authAction'

import Field from 'components/Field'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Password from 'components/Password'

import style from './index.module.scss'

const INITIAL_FILTER = { real_balance: '', password: '' }

const Login = ({ active, setActive }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { auth } = useAuth()
  const { request, error} = useApi()
  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)
  const isShift = auth.shift?.status === '1'

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = buildFormData(filter)
    const json = await request(REQUEST_TYPE.POST, `shifts/${isShift ? 'close' : 'open'}/`, formData)

    if (!error) {
      dispatch(setAuth(json))
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
