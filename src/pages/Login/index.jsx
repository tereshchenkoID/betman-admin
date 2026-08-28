import { useTranslation } from 'react-i18next'

import { NAVIGATION, REQUEST_TYPE } from 'src/constant/config'

import { useAuthStore } from 'src/stores/authStore'
import { useApi } from 'src/hooks/useApi'
import { buildFormData } from 'src/helpers/buildFormData'
import { useFilterState } from 'src/hooks/useFilterState'

import Field from 'components/Field'
import Paper from 'components/Paper'
import Button from 'components/Button'
import Password from 'components/Password'

import style from './index.module.scss'

const INITIAL_FILTER = { username: '', password: '' }

const Login = () => {
  const { t } = useTranslation()
  const { request } = useApi()
  const { setAuth } = useAuthStore()
  const { filter, setFilter, handlePropsChange } = useFilterState(INITIAL_FILTER)

  const handleResetForm = () => {
    setFilter(INITIAL_FILTER)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = buildFormData(filter)
    const { data, error } = await request(REQUEST_TYPE.POST, 'login/', formData, { isWrapped: true })

    if (!error) {
      setAuth(data).then(() => {
        sessionStorage.setItem('language', JSON.stringify(data?.language?.code))
        window.location.href = '/'
      })
    }
  }

  return (
    <div className={style.block}>
      <Paper
        headline={t(NAVIGATION.login.text)}
        classes={['sm', style.wrapper]}
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
